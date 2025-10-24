const MAX_CONCURRENT_REQUESTS = 12; // 并行请求数量
const RETRY_TIMES = 2; // 出错重试次数

async function fetchCoupon(shopName, poi_id_str, env) {
  const body = {lat: 22.986847,lon: 113.126331,geoType: "GCJ02",geoSource: "network",geoAccuracy: 500,mediumParams: {pageSrc2: "0c3bfd35279b4140b3bd8ecbc41301d6",pageSrc1: "CPS_SELF_OUT_SRC_H5_LINK",
      pageSrc3: "e15d0d4258004ba5b44c1c85e4db4084",scene: "CPS_SELF_SRC",activityId: "6",poi_id_str: poi_id_str,mediumSrc1: "0c3bfd35279b4140b3bd8ecbc41301d6",outActivityId: "6",p: 1016502508465025024,mediaPvId: "dafkdsajffjafdfs",mediaUserId: "10086",bizId: "0c3bfd35279b4140b3bd8ecbc41301d6",callback: "jsonpWXLoader",poiId: "-100"},
appContainer: "UNKNOW",rootPvId: "0e2008a4-cafa-41c1-9c14-2b1d0bd92c4b",pagePvId: "e97e858c-34b8-4a40-aeb3-50ae9f178403",pageSessionId: "efa9df7e-3b74-4305-891b-6c0a8daa5438",outerPvId: "",contentPvId: "",recallBizId: "cpsSelfCouponAll",pageNo: 1,hasMore: true,phone: "",categoryTypeList: ["0"],channelType: "SELF",riskParams: { fpPlatform: 5 }
  };

   const headers = {
    'origin': 'https://offsiteact.meituan.com','accept-encoding': 'gzip, deflate, br','accept': '*/*','referer': `https://offsiteact.meituan.com/web/hoae/collection_waimai_v8/index.html?pageSrc2=0c3bfd35279b4140b3bd8ecbc41301d6&pageSrc1=CPS_SELF_OUT_SRC_H5_LINK&pageSrc3=e15d0d4258004ba5b44c1c85e4db4084&scene=CPS_SELF_SRC&rootPvId=0e2008a4-cafa-41c1-9c14-2b1d0bd92c4b&activityId=6&poi_id_str=${poi_id_str}&mediumSrc1=0c3bfd35279b4140b3bd8ecbc41301d6&outActivityId=6&p=1016502508465025024&mediaPvId=dafkdsajffjafdfs&mediaUserId=10086&bizId=0c3bfd35279b4140b3bd8ecbc41301d6&callback=jsonpWXLoader&poiId=-100`,
    'sec-fetch-mode': 'cors','sec-fetch-site': 'same-origin','accept-language': 'zh-CN,zh-Hans;q=0.9',
    'cookie': '_lxsdk_s=19a1150c1d6-8e8-b67-53e%7C%7C7; logan_session_token=vxzkerxrc86b7j4wpn9x; WEBDFPID=z53wyy01xv7u550x161z50x625uwuyvw80328zu4v2687958u380u3v0-1761257513891-1745664039919UGIKMYI868c0ee73ab28e1d0b03bc83148500061008; utm_source_rg=AM%254e9nOn9%25133; iuuid=77497BDC4901C49D5E90A1F9DF96F645B98296AC9AFBD28C9BF3A93155DE0C39; com.sankuai.wmdadoutsite.fe_random=_63.0; wm_ado_ge_x=2QIEE%2BVvVKxpBXOe%2BAR86mRXV%2BdSNRpkhVmxK1Ms3zfT6ivprLZ7LTFctmazeQI1tIxv92KMQtDrhq86RpiC4ccipLut3jn63FoqfSWCXU%2FJG1zWE0ReHlRLEcyg47mZime3DqC03pOK3Tvw3EFhNlqhX6lkd%2BsekQsFsGFWu1WZqFWO033jDNo0Gh3yx%2FvSFpejjsmBTDtQZ7hDTzIuqtCpdLjWtA8ea2G73fM5VGY%3D; mt_c_token=AgFbJo6SxK3DpJcpMM3P48ZCjDiQGXRFWL6GGnp4VgdzaZirz_fjU4upZxr1GHH_j4u0GXa54vWAMAAAAABKKwAAgCmL6cqO3noU6uiixfwKWUGxfCViu8uMgsGSq2CVW6N5yKGLFf7D2Pm-fw8ZldMM; oops=AgFbJo6SxK3DpJcpMM3P48ZCjDiQGXRFWL6GGnp4VgdzaZirz_fjU4upZxr1GHH_j4u0GXa54vWAMAAAAABKKwAAgCmL6cqO3noU6uiixfwKWUGxfCViu8uMgsGSq2CVW6N5yKGLFf7D2Pm-fw8ZldMM; token=AgFbJo6SxK3DpJcpMM3P48ZCjDiQGXRFWL6GGnp4VgdzaZirz_fjU4upZxr1GHH_j4u0GXa54vWAMAAAAABKKwAAgCmL6cqO3noU6uiixfwKWUGxfCViu8uMgsGSq2CVW6N5yKGLFf7D2Pm-fw8ZldMM; userId=2611035973; _lxsdk_cuid=19671af5c41c8-00002ff28e816c-7c6f3d58-505c8-19671af5c41c8; _lxsdk=77497BDC4901C49D5E90A1F9DF96F645B98296AC9AFBD28C9BF3A93155DE0C39',
    'mtgsig': JSON.stringify({ a1: "1.2", a2: Date.now(), a3: "z53wyy01xv7u550x161z50x625uwuyvw80328zu4v2687958u380u3v0", a5: "oVjAOcgNjj6drqWh0Ubeyg4KnNi785b5e/t6eKkotxd350Tc3Vi86EzVWQhAMkrJ37bU7EJE4Nb/xv36wzkdq4bU0mZ8mEZ1XLes3W4K691QgiSjpcTgL1mAMqwORW==", a6: "h1.9gWg/ByL6/Q+dkFaG52FW+tgwc3rraYxeTD9Vs6LQUpEzdcQ+APN9Xyy/w9Er0olxFSqAMXz+oCrASX0gIPpm4cPDGeBY0UbNJOzmydKSBAKOt6c1YHQyl/fZYtMWkH+wzXsANLR/c88rvspt+RemdcNrcis+SDhKS3itQVkJvC/YJhXgRV937wIf3TSc+uoKoVesVD8sVhgvC3FGeQ7M51+z+G1piZkFFtlXPVQLp8g=", a8: "470b09d42a36b46fae88765f3ad8858f", a9: "4.1.1,7,195", a10: "28", x0: 4, d1: "6f961e29be5a92d1eb8b5a5dd1cc8cf6" }),
    'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_0_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/141.0.7390.96 Mobile/15E148 Safari/604.1','content-type': 'application/json;charset=utf-8'
  };
  //映射
    const couponMap = {100: "8-1",200: "10-2",300: "12-3",400: "13-4",500: "15-5"};
  for (let i = 0; i <= RETRY_TIMES; i++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000); // 5秒超时
      const t0 = Date.now();
      const resp = await fetch('https://offsiteact.meituan.com/act/ge/queryPoiByRecallBiz?yodaReady=h5&csecplatform=4&csecversion=4.1.1', {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        signal: controller.signal});
    
      clearTimeout(timeout);

      const text = await resp.text();
     
      // ✅ 修正提取逻辑
     // ✅ 修正提取逻辑
let couponText = '无';
try {
  const data = await resp.json();  // 改回原来的 json 方式
  if (data.infos && data.infos.length > 0) {
    const firstInfo = data.infos[0];
    if (firstInfo.giftInfo && firstInfo.giftInfo.coupon_amount != null) {
      const raw = firstInfo.giftInfo.coupon_amount;
      couponText = couponMap[raw] || raw; // 保留映射转换
    }
  }
} catch {
  couponText = "解析失败";
}

// ✅ 写入 SHOP KV
await env.SHOP.put(poi_id_str, `${shopName} ${couponText}`);

// ✅ 返回字符串（包含耗时）
const ms = Date.now() - t0;
return `${shopName} ${couponText} (${ms} ms)`;


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
        list.keys.map(async (k) => {
          const shopName = await env.SJQ.get(k.name);
          return { poi_id_str: k.name, shopName };
        })
      );

      const results = await asyncPool(
        MAX_CONCURRENT_REQUESTS,
        kvItems,
        (item) => fetchCoupon(item.shopName, item.poi_id_str, env)
      );

      return new Response(results.join("\n"), {
        status: 200,
        headers: { "Content-Type": "text/plain;charset=UTF-8" }
      });
    } catch (err) {
      return new Response(err.toString(), { status: 500 });
    }
  }
};
