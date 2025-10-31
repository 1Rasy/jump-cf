export default {
  async fetch(request, env, ctx) {
    const { SJQ, SHOP } = env;
    const url = "https://offsiteact.meituan.com/act/ge/queryPoiByRecallBiz?yodaReady=h5&csecplatform=4&csecversion=4.1.1";

    const couponMap = {
      1000: "10", 2000: "20", 3000: "30", 4000: "40", 5000: "50"
    };

    // 获取 SJQ 中所有 key（商家名称）
    const list = await SJQ.list({ limit: 1000 });
    const results = [];

    for (const item of list.keys) {
      const shopName = item.name;
      const poi_id_str = await SJQ.get(shopName);
      if (!poi_id_str) continue;

      // 构造请求头和 body
      const headers = {
        'referer': `https://offsiteact.meituan.com/web/hoae/collection_waimai_v8/index.html?poi_id_str=${poi_id_str}`,
        'content-type': 'application/json;charset=utf-8',
        'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_0_0 like Mac OS X)',
        'accept': '*/*'
      };

      const body = JSON.stringify({
        lat: 22.980764,
        lon: 113.103541,
        geoType: "GCJ02",
        geoSource: "network",
        geoAccuracy: 500,
        mediumParams: { poi_id_str },
        appContainer: "UNKNOW",
        recallBizId: "cpsEverDayCoupon",
        pageNo: 1,
        hasMore: true,
        channelType: "SELF",
        riskParams: { fpPlatform: 5 }
      });

      try {
        const res = await fetch(url, { method: "POST", headers, body });
        const text = await res.text();

        console.log(`✅ [${shopName}] 响应前100字: ${text.slice(0, 100)}`);

        let couponAmount = "无";
        try {
          // 尝试解析 JSON（可能是 JSONP）
          const json = JSON.parse(text.replace(/^jsonpWXLoader\(|\)$/g, ""));
          if (Array.isArray(json.infos) && json.infos.length > 0) {
            const firstInfo = json.infos[0];
            if (firstInfo.giftInfo && firstInfo.giftInfo.coupon_amount != null) {
              const raw = firstInfo.giftInfo.coupon_amount;
              couponAmount = couponMap[Number(raw)] || String(raw);
            }
          }
        } catch (e) {
          console.log(`⚠️ [${shopName}] JSON解析失败`);
        }

        // 写入 SHOP KV
        const newKey = `${shopName} ${couponAmount}`;
        await SHOP.put(newKey, poi_id_str);

        results.push(`${shopName}:${couponAmount}`);
      } catch (err) {
        console.log(`❌ [${shopName}] 请求错误: ${err.message}`);
      }
    }

    return new Response(`完成，共处理 ${results.length} 条\n` + results.join("\n"), {
      headers: { "content-type": "text/plain;charset=utf-8" }
    });
  }
};
