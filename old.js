const MAX_CONCURRENT_REQUESTS = 12; // 并行请求数量
const RETRY_TIMES = 2; // 出错重试次数

const couponMap = {100: "8-1", 200: "10-2", 300: "12-3", 400: "13-4", 500: "15-5"};

// 获取优惠券信息
async function fetchCoupon(shopName, poi_id_str, env) {
  const body = {/* 你的请求体 */};
  const headers = {/* 你的请求头 */};

  for (let i = 0; i <= RETRY_TIMES; i++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const resp = await fetch(
        'https://offsiteact.meituan.com/act/ge/queryPoiByRecallBiz?yodaReady=h5&csecplatform=4&csecversion=4.1.1',
        { method: 'POST', headers, body: JSON.stringify(body), signal: controller.signal }
      );

      clearTimeout(timeout);

      const data = await resp.json();

      // 安全提取 coupon_amount
      let couponAmount = '无';
      if (Array.isArray(data.infos) && data.infos.length > 0) {
        const firstInfo = data.infos[0];
        if (firstInfo.giftInfo && firstInfo.giftInfo.coupon_amount != null) {
          const raw = firstInfo.giftInfo.coupon_amount;
          couponAmount = couponMap[Number(raw)] || String(raw);
        }
      }

      // 写入 SHOP KV
      if (env.SHOP) {
        await env.SHOP.put(poi_id_str, `${shopName} ${couponAmount}`);
      }

      // 返回用于生成按钮的文本
      return `${shopName} ${couponAmount}`;

    } catch (err) {
      if (i === RETRY_TIMES) {
        return `${shopName} 无`;
      }
    }
  }
}

// 并发池
async function asyncPool(limit, array, iteratorFn) {
  const ret = [];
  const executing = [];

  for (const item of array) {
    const p = Promise.resolve().then(() => iteratorFn(item));
    ret.push(p);

    const e = p.then(() => executing.splice(executing.indexOf(e), 1));
    executing.push(e);

    if (executing.length >= limit) {
      await Promise.race(executing);
    }
  }

  return Promise.all(ret);
}

// Worker 入口
export default {
  async fetch(request, env) {
    try {
      if (!env.SJQ) return new Response("KV SJQ not bound", { status: 500 });

      // 获取 SJQ KV 所有 key
      const list = await env.SJQ.list();
      const kvItems = await Promise.all(
        list.keys.map(async k => {
          const shopName = await env.SJQ.get(k.name);
          return { poi_id_str: k.name, shopName };
        })
      );

      // 并发请求更新 SHOP KV
      const results = await asyncPool(MAX_CONCURRENT_REQUESTS, kvItems, item =>
        fetchCoupon(item.shopName, item.poi_id_str, env)
      );

      // 生成按钮 HTML
      const buttonsHtml = results.map((text, idx) => {
        const item = kvItems[idx];
        return `<button onclick="window.location.href='${item.poi_id_str}'"
                        style="margin:5px;padding:10px 15px;font-size:14px;cursor:pointer;">
                  ${text}
                </button>`;
      }).join("\n");

      const html = `
        <!DOCTYPE html>
        <html lang="zh">
        <head>
          <meta charset="UTF-8">
          <title>商家优惠列表</title>
        </head>
        <body>
          <h2>商家优惠</h2>
          ${buttonsHtml}
        </body>
        </html>
      `;

      return new Response(html, {
        status: 200,
        headers: { "Content-Type": "text/html;charset=UTF-8" }
      });

    } catch (err) {
      return new Response(err.toString(), { status: 500 });
    }
  }
};