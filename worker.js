export default {
  async fetch(request, env) {
    try {
      // 获取 query 参数 poi_id，可选
      const urlObj = new URL(request.url);
      const poi_id = urlObj.searchParams.get("poi_id") || "-100";

      // 从 KV 获取 longurl
      const longurl = await env.SJQ.get("LONGURL_KEY"); // 替换为你存的 KV key
      if (!longurl) return new Response(JSON.stringify({ error: "KV中没有数据" }), { status: 404 });

      // 构造请求
      const meituanUrl = "https://offsiteact.meituan.com/act/ge/queryPoiByRecallBiz?yodaReady=h5&csecplatform=4&csecversion=4.1.1";

      // 时间戳动态
      const timestamp = Date.now();

      // 请求头，固定 cookie 和 mtgsig
      const headers = {
        'origin': 'https://offsiteact.meituan.com',
        'accept': '*/*',
        'referer': longurl,
        'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_0_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/141.0.7390.96 Mobile/15E148 Safari/604.1',
        'content-type': 'application/json;charset=utf-8',
        'cookie': '_lxsdk_s=固定cookie; mt_c_token=固定token; token=固定token', // 可直接写固定值
        'mtgsig': JSON.stringify({
          a1: "1.2",
          a2: timestamp,
          a3: "固定值",
          a5: "固定值",
          a6: "固定值",
          a8: "固定值",
          a9: "4.1.1,7,195",
          a10: "28",
          x0: 4,
          d1: "固定值"
        })
      };

      // 请求体
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
          poi_id_str: poi_id,
          mediumSrc1: "0c3bfd35279b4140b3bd8ecbc41301d6",
          outActivityId: "6",
          p: "1016502508465025024",
          mediaPvId: "dafkdsajffjafdfs",
          mediaUserId: "10086",
          bizId: "0c3bfd35279b4140b3bd8ecbc41301d6",
          callback: "jsonpWXLoader",
          poiId: poi_id
        },
        appContainer: "UNKNOW",
        rootPvId: "0e2008a4-cafa-41c1-9c14-2b1d0bd92c4",
        pagePvId: "e97e858c-34b8-4a40-aeb3-50ae9f178403",
        pageSessionId: "efa9df7e-3b74-4305-891b-6c0a8daa5438",
        recallBizId: "cpsSelfCouponAll",
        pageNo: 1,
        hasMore: true,
        phone: "",
        categoryTypeList: ["0"],
        channelType: "SELF",
        riskParams: { fpPlatform: 5 }
      };

      const response = await fetch(meituanUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(body)
      });

      const data = await response.json();

      // 提取 coupon_amount
      let coupon_amount = null;
      if (data.info && data.info.length > 0) {
        const first = data.info.find(item => item.giftInfo && item.giftInfo.coupoun_amount);
        if (first) coupon_amount = first.giftInfo.coupoun_amount;
      }

      return new Response(JSON.stringify({ coupon_amount }), {
        headers: { "Content-Type": "application/json" }
      });

    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  }
}
