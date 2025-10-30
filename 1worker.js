const MAX_CONCURRENT_REQUESTS = 12;
const RETRY_TIMES = 2;
const couponMap = { 100: "8-1", 200: "10-2", 300: "12-3", 400: "13-4", 500: "15-5" };

// 并发池
async function asyncPool(limit, array, iteratorFn) {
  const ret = [];
  const executing = [];
  for (const item of array) {
    const p = Promise.resolve().then(() => iteratorFn(item));
    ret.push(p);
    executing.push(p);
    if (executing.length >= limit) {
      await Promise.race(executing);
      // 移除已完成的 promise
      for (let i = executing.length - 1; i >= 0; i--) {
        if (executing[i].status === "fulfilled") executing.splice(i, 1);
      }
    }
  }
  return Promise.all(ret);
}

// 获取优惠券并更新 SHOP KV
async function fetchCoupon(shopName, poi_id_str, env) {
  const url = "https://offsiteact.meituan.com/act/ge/queryPoiByRecallBiz?yodaReady=h5&csecplatform=4&csecversion=4.1.1";

  const body = {  lat: 22.980762,
    lon: 113.103535,
    geoType: "GCJ02",
    geoSource: "network",
    geoAccuracy: 500,
    mediumParams: {
      recallBizId: "cpsH5Coupon",
      bizId: "0c3bfd35279b4140b3bd8ecbc41301d6",
      mediumSrc1: "0c3bfd35279b4140b3bd8ecbc41301d6",
      scene: "CPS_SELF_SRC",
      pageSrc1: "CPS_SELF_OUT_SRC_H5_LINK",
      pageSrc2: "0c3bfd35279b4140b3bd8ecbc41301d6",
      pageSrc3: "e15d0d4258004ba5b44c1c85e4db4084",
      activityId: "6",
      mediaPvId: "dafkdsajffjafdfs",
      mediaUserId: "10086",
      outActivityId: "6",
      hoaePageV: "8",
      p: "1016502508465025024",
    },
    appContainer: "UNKNOW",
    rootPvId: "669c0826-95f2-4024-9586-58759ede9614",
    pagePvId: "c4c582e0-bf9a-4428-a75f-9331fe665349",
    pageSessionId: "4dc180de-cfa0-4b28-b482-a44945b103c9",
    outerPvId: "",
    contentPvId: "",
    recallBizId: "cpsSelfCouponAll",
    pageNo: 1,
    hasMore: true,
    phone: "",
    categoryTypeList: ["0"],
    channelType: "SELF",
    riskParams: { fpPlatform: 5 } };
  const headers = {
    'cookie': 'WEBDFPID=z53wyy01xv7u550x161z50x625uwuyvw80328zu4v2687958u380u3v0-1761941997649-1745664039919UGIKMYI868c0ee73ab28e1d0b03bc83148500061008;_lxsdk_s=19a36c6e9b0-85d-6f8-46d%7C%7C15;wm_ado_ge_e_k=yV9z57djWtciJhM4%2FQQykpF%2B6V03YdJ%2F38pS4kj0owizOSzW5WaJY7SOvw4o%2BVpK;logan_session_token=o9b3cpnvultw5ctmxxw1;utm_source_rg=AM%25oeVwZwZ%25462;iuuid=77497BDC4901C49D5E90A1F9DF96F645B98296AC9AFBD28C9BF3A93155DE0C39;wm_ado_ge_x=2QIEE%2BVvVKxpBXOe%2BAR86mRXV%2BdSNRpkhVmxK1Ms3zfT6ivprLZ7LTFctmazeQI1tIxv92KMQtDrhq86RpiC4ccipLut3jn63FoqfSWCXU%2FJG1zWE0ReHlRLEcyg47mZime3DqC03pOK3Tvw3EFhNlqhX6lkd%2BsekQsFsGFWu1VfEy0wX7gu57C8ASgiAnyfS3UAqhhvmOrL3%2Bl3wc973zP3ejTbL9biQU9Xz%2B2lLIw%3D;com.sankuai.wmdadoutsite.fe_random=_63.0;mt_c_token=AgFbJo6SxK3DpJcpMM3P48ZCjDiQGXRFWL6GGnp4VgdzaZirz_fjU4upZxr1GHH_j4u0GXa54vWAMAAAAABKKwAAgCmL6cqO3noU6uiixfwKWUGxfCViu8uMgsGSq2CVW6N5yKGLFf7D2Pm-fw8ZldMM;oops=AgFbJo6SxK3DpJcpMM3P48ZCjDiQGXRFWL6GGnp4VgdzaZirz_fjU4upZxr1GHH_j4u0GXa54vWAMAAAAABKKwAAgCmL6cqO3noU6uiixfwKWUGxfCViu8uMgsGSq2CVW6N5yKGLFf7D2Pm-fw8ZldMM;token=AgFbJo6SxK3DpJcpMM3P48ZCjDiQGXRFWL6GGnp4VgdzaZirz_fjU4upZxr1GHH_j4u0GXa54vWAMAAAAABKKwAAgCmL6cqO3noU6uiixfwKWUGxfCViu8uMgsGSq2CVW6N5yKGLFf7D2Pm-fw8ZldMM;userId=2611035973;_lxsdk_cuid=19671af5c41c8-00002ff28e816c-7c6f3d58-505c8-19671af5c41c8;_lxsdk=77497BDC4901C49D5E90A1F9DF96F645B98296AC9AFBD28C9BF3A93155DE0C39',
    'referer': 'https://offsiteact.meituan.com/web/hoae/collection_waimai_v8/index.html?recallBizId=cpsH5Coupon&bizId=0c3bfd35279b4140b3bd8ecbc41301d6&mediumSrc1=0c3bfd35279b4140b3bd8ecbc41301d6&scene=CPS_SELF_SRC&pageSrc1=CPS_SELF_OUT_SRC_H5_LINK&pageSrc2=0c3bfd35279b4140b3bd8ecbc41301d6&pageSrc3=e15d0d4258004ba5b44c1c85e4db4084&activityId=6&poi_id_str=${poi_id_str}&mediaPvId=dafkdsajffjafdfs&mediaUserId=10086&outActivityId=6&hoaePageV=8&p=1016502508465025024',
    'sec-fetch-site': 'same-origin',
    'accept-language': 'zh-CN,zh-Hans;q=0.9',
    'priority': 'u=3, i',
    'content-type': 'application/json;charset=utf-8',
    'accept-encoding': 'gzip, deflate, br',
    'mtgsig': JSON.stringify({
      a1: "1.2",
      a2: Date.now(), 
      a3: "z53wyy01xv7u550x161z50x625uwuyvw80328zu4v2687958u380u3v0",
      a5: "mZD8Xrtk8nKfdi8O0Y9XU1wqAZaDYz+k6Rfgt2qbvmHT002mPjsuOb719iOmFS6qx/i8N5YOkQfgubx+Wseay7ix+bo9qoGl/MxNddzoW6qXbUh3S0wBvUR7/4Ib",
      a6: "h1.9ho9SYpgmFmewHm6/6ke2k0Vcu0bAputmTm4P1CHZNPbn8CO/Ytb9Dc9fV2u5YjVMnaX0XNLVC4Lp3BIsSXtuzYf7he34msvsYnFavTOEBVQKT60tkmz9U2s3EHcRHdpp/EuA7RzAnlmnn1h27nsTYdZjrDYVJzfDtn7Dl700aGxtgjd1/FnRO334ucgKHje7Oe83b2ecGY5nnsMufZoqyuxyVy0rL/V86kZmscNHazU=",
      a8: "8f702a0c72d2fc22b600c162ff0a4eb8",
      a9: "4.1.1,7,105",
      a10: "72",
      x0: 4,
      d1: "0da3d43a7d2790d347171017708444e7"
    }),
    'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_0_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/141.0.7390.96 Mobile/15E148 Safari/604.1',
    'sec-fetch-dest': 'empty',
    'accept': '*/*',
    'origin': 'https://offsiteact.meituan.com',
    'sec-fetch-mode': 'cors',
};

  for (let i = 0; i <= RETRY_TIMES; i++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const resp = await fetch(url, { method: "POST", headers, body: JSON.stringify(body), signal: controller.signal });
      clearTimeout(timeout);

      const text = await resp.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.log("返回的不是 JSON：", text.slice(0, 200));
        return `${shopName} 无`;
      }

      let couponAmount = "无";
      if (Array.isArray(data.infos) && data.infos.length > 0) {
        const firstInfo = data.infos[0];
        if (firstInfo.giftInfo && firstInfo.giftInfo.coupon_amount != null) {
          const raw = firstInfo.giftInfo.coupon_amount;
          couponAmount = couponMap[Number(raw)] || String(raw);
        }
      }

      // ✅ 写入 KV 并打印日志
      if (env.SHOP) {
        await env.SHOP.put(poi_id_str, `${shopName} ${couponAmount}`);
        console.log(`✅ 写入 SHOP KV 成功: ${poi_id_str} -> ${shopName} ${couponAmount}`);
      }

      return `${shopName} ${couponAmount}`;
    } catch (err) {
      if (i === RETRY_TIMES) {
        console.error(`❌ 写入 SHOP KV 失败: ${poi_id_str} -> ${shopName}`, err);
        return `${shopName} 无`;
      }
    }
  }
}


// ------------------- Worker 主体 -------------------
export default {
  async scheduled(event, env, ctx) {
    const start = Date.now();
    console.log(
      "⏰ Cron 触发于:",
      new Date(event.scheduledTime).toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })
    );

    try {
      // ① 清空 SHOP KV
      const existing = await env.SHOP.list({ limit: 1000 });
      if (existing.keys.length > 0) {
        console.log("🧹 正在清空 SHOP KV，共", existing.keys.length, "条...");
        await Promise.all(existing.keys.map((k) => env.SHOP.delete(k.name)));
        console.log("✅ SHOP KV 已清空");
      } else {
        console.log("📭 SHOP KV 本为空，无需清理");
      }

      // ② 从 SJQ 获取商家列表
      const list = await env.SJQ.list({ limit: 1000 });
      const kvItems = [];
      for (const k of list.keys) {
        const shopName = await env.SJQ.get(k.name);
        if (shopName) kvItems.push({ poi_id_str: k.name, shopName });
      }

      // ③ 并发抓取并写入新的 SHOP 数据
      await Promise.all(kvItems.map((item) => fetchCoupon(item.shopName, item.poi_id_str, env)));

      const duration = ((Date.now() - start) / 1000).toFixed(1);
      console.log(`✅ 定时更新完成，共处理 ${kvItems.length} 条商家数据，用时 ${duration}s。`);
    } catch (err) {
      console.error("❌ 定时任务出错:", err);
    }
  },
};
