const MAX_CONCURRENT_REQUESTS = 5; // 并行请求数量
const RETRY_TIMES = 2; // 出错重试次数

async function fetchCoupon(shopName, poi_id_str) {
  const body = {
    lat: 22.986847,
    lon: 113.126331,
    geoType: "GCJ02",
    geoSource: "network",
    geoAccuracy: 500,
    mediumParams: {
      pageSrc2: "0c3bfd35279b4140b3bd8ecbc41301d6",
      pageSrc1: "CPS_SELF_OUT_SRC_H5_LINK",
      pageSrc3: "e15d0d4258004ba5b44c1c85e4db4084",
      scene: "CPS_SELF_SRC",
      activityId: "6",
      poi_id_str: poi_id_str,
      mediumSrc1: "0c3bfd35279b4140b3bd8ecbc41301d6",
      outActivityId: "6",
      p: Date.now().toString(),
      mediaPvId: "dafkdsajffjafdfs",
      mediaUserId: "10086",
      bizId: "0c3bfd35279b4140b3bd8ecbc41301d6",
      callback: "jsonpWXLoader",
      poiId: "-100"
    },
    appContainer: "UNKNOW",
    rootPvId: "0e2008a4-cafa-41c1-9c14-2b1d0bd92c4b",
    pagePvId: "e97e858c-34b8-4a40-aeb3-50ae9f178403",
    pageSessionId: "efa9df7e-3b74-4305-891b-6c0a8daa5438",
    outerPvId: "",
    contentPvId: "",
    recallBizId: "cpsSelfCouponAll",
    pageNo: 1,
    hasMore: true,
    phone: "",
    categoryTypeList: ["0"],
    channelType: "SELF",
    riskParams: { fpPlatform: 5 }
  };

  const headers = {
    'origin': 'https://offsiteact.meituan.com',
    'accept-encoding': 'gzip, deflate, br',
    'accept': '*/*',
    'referer': `https://offsiteact.meituan.com/web/hoae/collection_waimai_v8/index.html?pageSrc2=0c3bfd35279b4140b3bd8ecbc41301d6&pageSrc1=CPS_SELF_OUT_SRC_H5_LINK&pageSrc3=e15d0d4258004ba5b44c1c85e4db4084&scene=CPS_SELF_SRC&rootPvId=0e2008a4-cafa-41c1-9c14-2b1d0bd92c4b&activityId=6&poi_id_str=${poi_id_str}&mediumSrc1=0c3bfd35279b4140b3bd8ecbc41301d6&outActivityId=6&p=1016502508465025024&mediaPvId=dafkdsajffjafdfs&mediaUserId=10086&bizId=0c3bfd35279b4140b3bd8ecbc41301d6&callback=jsonpWXLoader&poiId=-100`,
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'accept-language': 'zh-CN,zh-Hans;q=0.9',
    'cookie': '_lxsdk_s=xxx; logan_session_token=xxx; ...',
    'mtgsig': JSON.stringify({ a1: "1.2", a2: Date.now(), a3: "xxx", a5: "xxx", a6: "xxx", a8: "xxx", a9: "4.1.1,7,195", a10: "28", x0: 4, d1: "xxx" }),
    'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_0_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/141.0.7390.96 Mobile/15E148 Safari/604.1',
    'content-type': 'application/json;charset=utf-8'
  };

  for (let i = 0; i <= RETRY_TIMES; i++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000); // 5秒超时
      const resp = await fetch('https://offsiteact.meituan.com/act/ge/queryPoiByRecallBiz?yodaReady=h5&csecplatform=4&csecversion=4.1.1', {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        signal: controller.signal
      });
      clearTimeout(timeout);

      const data = await resp.json();

      // ✅ 修正提取逻辑
      let couponAmount = '无';
      if (data.infos && data.infos.length > 0) {
        const firstInfo = data.infos[0];
        if (firstInfo.giftInfo && firstInfo.giftInfo.coupon_amount != null) {
          couponAmount = firstInfo.giftInfo.coupon_amount;
        }
      }

      return `${shopName} ${couponAmount}`;
    } catch (err) {
      if (i === RETRY_TIMES) {
        return `${shopName} 无`;
      }
    }
  }
}

async function asyncPool(limit, array, iteratorFn) {
  const ret = [];
  const executing = [];
  for (const item of array) {
    const p = Promise.resolve().then(() => iteratorFn(item));
    ret.push(p);

    if (limit <= array.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      if (executing.length >= limit) {
        await Promise.race(executing);
      }
    }
  }
  return Promise.all(ret);
}

export default {
  async fetch(request, env) {
    try {
      const list = await env.SJQ.list();
      const kvItems = await Promise.all(
        list.keys.map(async k => {
          const shopName = await env.SJQ.get(k.name);
          return { poi_id_str: k.name, shopName };
        })
      );

      const results = await asyncPool(MAX_CONCURRENT_REQUESTS, kvItems, item => fetchCoupon(item.shopName, item.poi_id_str));

      return new Response(results.join('\n'), { status: 200, headers: { 'Content-Type': 'text/plain;charset=UTF-8' } });
    } catch (err) {
      return new Response(err.toString(), { status: 500 });
    }
  }
};