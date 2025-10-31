export default {
  async fetch(request, env, ctx) {
    const url = "https://offsiteact.meituan.com/act/ge/queryPoiByRecallBiz?yodaReady=h5&csecplatform=4&csecversion=4.1.1";

    const headers = {
      'referer': 'https://offsiteact.meituan.com/web/hoae/collection_waimai_v8/index.html?pageSrc2=0c3bfd35279b4140b3bd8ecbc41301d6&pageSrc1=CPS_SELF_OUT_SRC_H5_LINK&pageSrc3=e15d0d4258004ba5b44c1c85e4db4084&scene=CPS_SELF_SRC&rootPvId=0e2008a4-cafa-41c1-9c14-2b1d0bd92c4b&activityId=6&poi_id_str=4gRpe9XGOibD_PxlNzSaIQI&mediumSrc1=0c3bfd35279b4140b3bd8ecbc41301d6&outActivityId=6&p=1016502508465025024&mediaPvId=dafkdsajffjafdfs&mediaUserId=10086&bizId=0c3bfd35279b4140b3bd8ecbc41301d6&callback=jsonpWXLoader&poiId=-100',
      'content-type': 'application/json;charset=utf-8',
      'origin': 'https://offsiteact.meituan.com',
      'accept-language': 'zh-CN,zh-Hans;q=0.9',
      'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_0_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/141.0.7390.96 Mobile/15E148 Safari/604.1',
      'accept': '*/*',
      'mtgsig': '{"a1":"1.2","a2":date.now(),"a3":"z53wyy01xv7u550x161z50x625uwuyvw80328zu4v2687958u380u3v0","a5":"ATfLIFpacz+vv//e5l7miU1e/rmDWdybEPYA+Br0z1gFXJbIv+5RaVU9Yv4NCZV/ax2UM8F+BRWENrypvVdJyII8SgkBat3qlLYfSN9AFQKqNGLkP2GzXKZXGCm0gZ==","a6":"h1.9TGmgkIok7Z/iFN6TFOvr+U//V899TXJ7gkqIzsCUQvfuv8CL8ijYg+JWirC2I8M2BfBgvORoaOmvVGete3Pakd8EmZ2PL4tmsZmg2/b+C7zXJ+biOqrDON5B55rKjy1YiV2YMA77/4bbz8rAMcmwtst0QNyLnTNOMP22XS9P5Jzbnbb2oBcItf5R8C9tm7h0BqFohnxphihe7oqflBGAbtm3uiyCsGFLd2GG1eeEBic=","a8":"5959fb0a47997a810e810ab4c5803622","a9":"4.1.1,7,22","a10":"ac","x0":4,"d1":"69b05e8e0028a2cf6b031a336998fc4c"}',
    };

    const body = JSON.stringify({
      lat: 22.980764,
      lon: 113.103541,
      geoType: "GCJ02",
      geoSource: "network",
      geoAccuracy: 500,
      mediumParams: {
        pageSrc2: "0c3bfd35279b4140b3bd8ecbc41301d6",
        pageSrc1: "CPS_SELF_OUT_SRC_H5_LINK",
        pageSrc3: "e15d0d4258004ba5b44c1c85e4db4084",
        scene: "CPS_SELF_SRC",
        activityId: "6",
        poi_id_str: "4gRpe9XGOibD_PxlNzSaIQI",
        mediumSrc1: "0c3bfd35279b4140b3bd8ecbc41301d6",
        outActivityId: "6",
        p: "1016502508465025024",
        mediaPvId: "dafkdsajffjafdfs",
        mediaUserId: "10086",
        bizId: "0c3bfd35279b4140b3bd8ecbc41301d6",
        callback: "jsonpWXLoader",
        poiId: "-100"
      },
      appContainer: "UNKNOW",
      rootPvId: "0e2008a4-cafa-41c1-9c14-2b1d0bd92c4b",
      pagePvId: "8e2aaa48-20a1-46b1-a4b2-cdd21e9a3bfc",
      pageSessionId: "0f3b463a-cd60-4767-a344-67346c2e654e",
      outerPvId: "",
      contentPvId: "",
      recallBizId: "cpsEverDayCoupon",
      pageNo: 1,
      hasMore: true,
      phone: "",
      channelType: "SELF",
      riskParams: { fpPlatform: 5 }
    });

    try {
      const res = await fetch(url, {
        method: "POST",
        headers,
        body,
      });

      const text = await res.text(); // 不用 .json()，因为可能返回 JSONP
      console.log("Response status:", res.status);
      console.log("Response headers:", JSON.stringify([...res.headers]));
      console.log("Response body:", text);

      return new Response(text, {
        headers: { "content-type": "text/plain;charset=utf-8" },
      });

    } catch (err) {
      return new Response("Request failed: " + err.message, { status: 500 });
    }
  }
};
