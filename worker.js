export default {
  async fetch(request, env) {
    try {
      // 从 KV 里获取所有商家
      const list = [];
      let cursor;
      do {
        const resp = await env.SJQ.list({ cursor, limit: 100 });
        list.push(...resp.keys);
        cursor = resp.cursor;
      } while (cursor);

      // 遍历 KV 里的每个 key
      const results = [];
      for (const item of list) {
        const shopId = item.name;           // KV key
        const shopName = await env.SJQ.get(shopId); // KV value

        // 拼接 longurl
        const longurl = `https://offsiteact.meituan.com/web/hoae/collection_waimai_v8/index.html?pageSrc2=0c3bfd35279b4140b3bd8ecbc41301d6&pageSrc1=CPS_SELF_OUT_SRC_H5_LINK&pageSrc3=e15d0d4258004ba5b44c1c85e4db4084&scene=CPS_SELF_SRC&rootPvId=0e2008a4-cafa-41c1-9c14-2b1d0bd92c4b&activityId=6&poi_id_str=${shopId}&mediumSrc1=0c3bfd35279b4140b3bd8ecbc41301d6&outActivityId=6&p=1016502508465025024&mediaPvId=dafkdsajffjafdfs&mediaUserId=10086&bizId=0c3bfd35279b4140b3bd8ecbc41301d6&callback=jsonpWXLoader&poiId=-100`;

        // 构造请求头
        const headers = {
          'origin': 'https://offsiteact.meituan.com',
          'accept': '*/*',
          'referer': longurl,
          'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_0_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/141.0.7390.96 Mobile/15E148 Safari/604.1',
          'content-type': 'application/json;charset=utf-8',
          'cookie': '_lxsdk_s=19a1150c1d6-8e8-b67-53e||7; logan_session_token=vxzkerxrc86b7j4wpn9x; ...', // 固定 cookie
          'mtgsig': JSON.stringify({
            a1:"1.2",
            a2:Date.now(),
            a3:"z53wyy01xv7u550x161z50x625uwuyvw80328zu4v2687958u380u3v0",
            a5:"oVjAOcgNjj6drqWh0Ubeyg4KnNi785b5e/t6eKkotxd350Tc3Vi86EzVWQhAMkrJ37bU7EJE4Nb/xv36wzkdq4bU0mZ8mEZ1XLes3W4K691QgiSjpcTgL1mAMqwORW==",
            a6:"h1.9gWg/ByL6/Q+dkFaG52FW+tgwc3rraYxeTD9Vs6LQUpEzdcQ+APN9Xyy/w9Er0olxFSqAMXz+oCrASX0gIPpm4cPDGeBY0UbNJOzmydKSBAKOt6c1YHQyl/fZYtMWkH+wzXsANLR/c88rvspt+RemdcNrcis+SDhKS3itQVkJvC/YJhXgRV937wIf3TSc+uoKoVesVD8sVhgvC3FGeQ7M51+z+G1piZkFFtlXPVQLp8g=",
            a8:"470b09d42a36b46fae88765f3ad8858f",
            a9:"4.1.1,7,195",
            a10:"28",
            x0:4,
            d1:"6f961e29be5a92d1eb8b5a5dd1cc8cf6"
          })
        };

        const body = {
          lat:22.986847,
          lon:113.126331,
          geoType:"GCJ02",
          geoSource:"network",
          geoAccuracy:500,
          mediumParams:{
            pageSrc2:"0c3bfd35279b4140b3bd8ecbc41301d6",
            pageSrc1:"CPS_SELF_OUT_SRC_H5_LINK",
            pageSrc3:"e15d0d4258004ba5b44c1c85e4db4084",
            scene:"CPS_SELF_SRC",
            activityId:"6",
            poi_id_str:shopId,
            mediumSrc1:"0c3bfd35279b4140b3bd8ecbc41301d6",
            outActivityId:"6",
            p:"1016502508465025024",
            mediaPvId:"dafkdsajffjafdfs",
            mediaUserId:"10086",
            bizId:"0c3bfd35279b4140b3bd8ecbc41301d6",
            callback:"jsonpWXLoader",
            poiId: "-100"
          },
          appContainer:"UNKNOW",
          rootPvId:"0e2008a4-cafa-41c1-9c14-2b1d0bd92c4",
          pagePvId:"e97e858c-34b8-4a40-aeb3-50ae9f178403",
          pageSessionId:"efa9df7e-3b74-4305-891b-6c0a8daa5438",
          recallBizId:"cpsSelfCouponAll",
          pageNo:1,
          hasMore:true,
          phone:"",
          categoryTypeList:["0"],
          channelType:"SELF",
          riskParams:{fpPlatform:5}
        };

        const resp = await fetch("https://offsiteact.meituan.com/act/ge/queryPoiByRecallBiz?yodaReady=h5&csecplatform=4&csecversion=4.1.1", {
          method: "POST",
          headers,
          body: JSON.stringify(body)
        });

        const data = await resp.json();

        let coupon_amount = null;
        if(data.info && data.info.length > 0){
          const first = data.info.find(i=>i.giftInfo && i.giftInfo.coupoun_amount);
          if(first) coupon_amount = first.giftInfo.coupoun_amount;
        }

        results.push({
          shopId,
          shopName,
          coupon_amount
        });
      }

      return new Response(JSON.stringify(results), { headers:{ "Content-Type":"application/json" } });

    } catch(e){
      return new Response(JSON.stringify({ error:e.message }), { status:500 });
    }
  }
}
