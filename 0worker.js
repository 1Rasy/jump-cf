const MAX_CONCURRENT_REQUESTS = 12; // 并行请求数量
const RETRY_TIMES = 2; // 出错重试次数

let htmlCache = null;
let cacheTime = 0;
let cachedSJQCount = 0; // 缓存 SJQ 条数

// 映射优惠券金额到文本
const couponMap = { 100: "8-1", 200: "10-2", 300: "12-3", 400: "13-4", 500: "15-5" };


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

// 获取优惠券并更新 SHOP KV
async function fetchCoupon(shopName, poi_id_str, env) {
  const body = { xx };
  const headers = {
    yyit: "/605.1.15 (KHTML, like Gecko) CriOS/141.0.7390.96 Mobile/15E148 Safari/604.1",
    "content-type": "application/json;charset=utf-8",
  };

  for (let i = 0; i <= RETRY_TIMES; i++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const resp = await fetch(
        "https://offsiteact.meituan.com/act/ge/queryPoiByRecallBiz?yodaReady=h5&csecplatform=4&csecversion=4.1.1",
        { method: "POST", headers, body: JSON.stringify(body), signal: controller.signal }
      );

      clearTimeout(timeout);
      const data = await resp.json();

      let couponAmount = "无";
      if (Array.isArray(data.infos) && data.infos.length > 0) {
        const firstInfo = data.infos[0];
        if (firstInfo.giftInfo && firstInfo.giftInfo.coupon_amount != null) {
          const raw = firstInfo.giftInfo.coupon_amount;
          couponAmount = couponMap[Number(raw)] || String(raw);
        }
      }

      if (env.SHOP) {
        await env.SHOP.put(poi_id_str, `${shopName} ${couponAmount}`);
      }

      return `${shopName} ${couponAmount}`;
    } catch (err) {
      if (i === RETRY_TIMES) return `${shopName} 无`;
    }
  }
}

// 根据 SHOP KV 生成 HTML
async function generateHTML(env, kvItems) {
  const buttonsHtml = await Promise.all(
    kvItems.map(async (item) => {
      const val = await env.SHOP.get(item.poi_id_str);
      const text = val || `${item.shopName} 无`;
      const link = `https://offsiteact.meituan.com/web/hoae/collection_waimai_v8/index.html?pageSrc2=0c3bfd35279b4140b3bd8ecbc41301d6&pageSrc1=CPS_SELF_OUT_SRC_H5_LINK&pageSrc3=e15d0d4258004ba5b44c1c85e4db4084&scene=CPS_SELF_SRC&rootPvId=0e2008a4-cafa-41c1-9c14-2b1d0bd92c4b&activityId=6&poi_id_str=${item.poi_id_str}&mediumSrc1=0c3bfd35279b4140b3bd8ecbc41301d6&outActivityId=6&p=1016502508465025024&mediaPvId=dafkdsajffjafdfs&mediaUserId=10086&bizId=0c3bfd35279b4140b3bd8ecbc41301d6&callback=jsonpWXLoader&poiId=-100`;
      return `<button onclick="window.location.href='${link}'">${text}</button>`;
    })
  );

  return `<html><body>${buttonsHtml.join("")}</body></html>`;
}

// 定时触发任务：每 10 分钟执行一次
export default {
  async scheduled(event, env, ctx) {
    console.log("⏰ Cron 触发于:", new Date(event.scheduledTime).toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" }));

    try {
      const list = await env.SJQ.list({ limit: 1000 });
      const sjqItems = [];

      for (const k of list.keys || []) {
        const v = await env.SJQ.get(k.name, { type: "json" });
        if (v && v.shopName && v.poi_id_str) sjqItems.push(v);
      }

      if (sjqItems.length === 0) {
        console.log("未找到 SJQ 数据");
        return;
      }

      await asyncPool(MAX_CONCURRENT_REQUESTS, sjqItems, async (item) => {
        return fetchCoupon(item.shopName, item.poi_id_str, env);
      });

      console.log("✅ 已完成十分钟更新任务，共处理", sjqItems.length, "条");
    } catch (err) {
      console.error("❌ 定时任务出错:", err);
    }
  },
};

<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>商家优惠列表</title>
<style>
body {
  font-family: 'system-ui', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  padding: 0 16px 16px;
  max-width: 600px;
  margin: 0 auto;
  background-color: #f8f9fa;
  color: #333;
}
button {
  display: block;
  margin: 10px 0;
  padding: 10px 12px;
  width: 100%;
  background-color: #fff;
  color: #222;
  border: 1px solid #ddd;
  border-radius: 6px;
  text-align: left;
  font-size: 16px;
  line-height: 1.2;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
button:active { background-color: #f0f0f0; }
#container { display: flex; flex-direction: column; }
</style>
</head>
<body>
<div id="container">
${buttonsHtml.join("\n")}
</div>
</body>
</html>
  `;
}

// ------------------- Worker Fetch -------------------
export default {
  async fetch(request, env) {
    try {
      if (!env.SJQ) return new Response("KV SJQ not bound", { status: 500 });

      const today0h1 = getTodayBeijing0h1();
      const list = await env.SJQ.list();

      let needUpdate = false;

      if (cacheTime <= today0h1) {
        needUpdate = true; // 新的一天
      } else if (list.keys.length !== cachedSJQCount) {
        needUpdate = true; // SJQ 条数变化
      }

      if (needUpdate) {
        const kvItems = await Promise.all(
          list.keys.map(async k => {
            const shopName = await env.SJQ.get(k.name);
            return { poi_id_str: k.name, shopName };
          })
        );

        await asyncPool(MAX_CONCURRENT_REQUESTS, kvItems, item =>
          fetchCoupon(item.shopName, item.poi_id_str, env)
        );

        htmlCache = await generateHTML(env, kvItems);
        cachedSJQCount = kvItems.length;
        cacheTime = Date.now();
      }

      return new Response(htmlCache, {
        status: 200,
        headers: {
          "Content-Type": "text/html;charset=UTF-8",
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0"
        }
      });
    } catch (err) {
      return new Response(err.toString(), { status: 500 });
    }
  }
};
