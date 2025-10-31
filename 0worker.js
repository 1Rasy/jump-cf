const API_URL = "https://offsiteact.meituan.com/act/ge/queryPoiByRecallBiz?yodaReady=h5&csecplatform=4&csecversion=4.1.1";
const FIXED_POI_ID_STR = "bc_2l5dH8RCKPVsC4oIXmAI";
const FIXED_P_VALUE = "1016502508465025024";

addEventListener('fetch', event => {
    event.respondWith(handleRequest());
});

async function handleRequest() {
    const logBuffer = [];
    const now = Date.now(); // 动态时间戳 for mtgsig.a2

    logBuffer.push(`Starting single request test for POI_ID: ${FIXED_POI_ID_STR}`);
    logBuffer.push(`Timestamp (a2): ${now}`);

    // --- 1. 动态生成 Referer ---
    const referer = `https://offsiteact.meituan.com/web/hoae/collection_waimai_v8/index.html?pageSrc2=0c3bfd35279b4140b3bd8ecbc41301d6&pageSrc1=CPS_SELF_OUT_SRC_H5_LINK&pageSrc3=e15d0d4258004ba5b44c1c85e4db4084&scene=CPS_SELF_SRC&rootPvId=0e2008a4-cafa-41c1-9c14-2b1d0bd92c4b&activityId=6&poi_id_str=${FIXED_POI_ID_STR}&mediumSrc1=0c3bfd35279b4140b3bd8ecbc41301d6&outActivityId=6&p=${FIXED_P_VALUE}&mediaPvId=dafkdsajffjafdfs&mediaUserId=10086&bizId=0c3bfd35279b4140b3bd8ecbc41301d6&callback=jsonpWXLoader&poiId=-100`;

    // --- 2. Headers ---
    const mtgsigObject = {
        a1: "1.2",
        a2: now, // 动态时间戳
        a3: "z53wyy01xv7u550x161z50x625uwuyvw80328zu4v2687958u380u3v0",
        a5: "ATfLIFpacz+vv//e5l7miU1e/rmDWdybEPYA+Br0z1gFXJbIv+5RaVU9Yv4NCZV/ax2UM8F+BRWENrypvVdJyII8SgkBat3qlLYfSN9AFQKqNGLkP2GzXKZXGCm0gZ==",
        a6: "h1.9TGmgkIok7Z/iFN6TFOvr+U//V899TXJ7gkqIzsCUQvfuv8CL8ijYg+JWirC2I8M2BfBgvORoaOmvVGete3Pakd8EmZ2PL4tmsZmg2/b+C7zXJ+biOqrDON5B55rKjy1YiV2YMA77/4bbz8rAMcmwtst0QNyLnTNOMP22XS9P5Jzbnbb2oBcItf5R8C9tm7h0BqFohnxphihe7oqflBGAbtm3uiyCsGFLd2GG1eeEBic=",
        a8: "5959fb0a47997a810e810ab4c5803622",
        a9: "4.1.1,7,22",
        a10: "ac",
        x0: 4,
        d1: "69b05e8e0028a2cf6b031a336998fc4c"
    };

    const cookieString = "WEBDFPID=z53wyy01xv7u550x161z50x625uwuyvw80328zu4v2687958u380u3v0-1762028463798-1745664039919UGIKMYI868c0ee73ab28e1d0b03bc83148500061008; _lxsdk_s=19a3bee48b8-a60-86c-838%7C%7C7; logan_session_token=p30097ad0h65azsxtbsv; utm_source_rg=AM%25e20O2O2%25506; wm_ado_ge_e_k=yV9z57djWtciJhM4%2FQQykpF%2B6V03YdJ%2F38pS4kj0owizOSzW5WaJY7SOvw4o%2BVpK; iuuid=77497BDC4901C49D5E90A1F9DF96F645B98296AC9AFBD28C9BF3A93155DE0C39; wm_ado_ge_x=2QIEE%2BVvVKxpBXOe%2BAR86mRXV%2BdSNRpkhVmxK1Ms3zfT6ivprLZ7LTFctmazeQI1tIxv92KMQtDrhq86RpiC4ccipLut3jn63FoqfSWCXU%2FJG1zWE0ReHlRLEcyg47mZime3DqC03pOK3Tvw3EFhNlqhX6lkd%2BsekQsFsGFWu1VfEy0wX7gu57C8ASgiAnyfS3UAqhhvmOrL3%2Bl3wc973zP3ejTbL9biQU9Xz%2B2lLIw%3D; com.sankuai.wmdadoutsite.fe_random=_63.0; mt_c_token=AgFbJo6SxK3DpJcpMM3P48ZCjDiQGXRFWL6GGnp4VgdzaZirz_fjU4upZxr1GHH_j4u0GXa54vWAMAAAAABKKwAAgCmL6cqO3noU6uiixfwKWUGxfCViu8uMgsGSq2CVW6N5yKGLFf7D2Pm-fw8ZldMM; oops=AgFbJo6SxK3DpJcpMM3P48ZCjDiQGXRFWL6GGnp4VgdzaZirz_fjU4upZxr1GHH_j4u0GXa54vWAMAAAAABKKwAAgCmL6cqO3noU6uiixfwKWUGxfCViu8uMgsGSq2CVW6N5yKGLFf7D2Pm-fw8ZldMM; token=AgFbJo6SxK3DpJcpMM3P48ZCjDiQGXRFWL6GGnp4VgdzaZirz_fjU4upZxr1GHH_j4u0GXa54vWAMAAAAABKKwAAgCmL6cqO3noU6uiixfwKWUGxfCViu8uMgsGSq2CVW6N5yKGLFf7D2Pm-fw8ZldMM; userId=2611035973; _lxsdk_cuid=19671af5c41c8-00002ff28e816c-7c6f3d58-505c8-19671af5c41c8; _lxsdk=77497BDC4901C49D5E90A1F9DF96F645B98296AC9AFBD28C9BF3A93155DE0C39";

    const headers = {
        'mtgsig': JSON.stringify(mtgsigObject),
        'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_0_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/141.0.7390.96 Mobile/15E148 Safari/604.1',
        'accept-encoding': 'gzip, deflate, br',
        'sec-fetch-dest': 'empty',
        'content-type': 'application/json;charset=utf-8',
        'accept': '*/*',
        'sec-fetch-mode': 'cors',
        'cookie': cookieString, 
        'referer': referer, 
        'priority': 'u=3, i',
        'sec-fetch-site': 'same-origin',
        'accept-language': 'zh-CN,zh-Hans;q=0.9',
        'origin': 'https://offsiteact.meituan.com',
    };

    // --- 3. Body ---
    const bodyObject = {
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
            poi_id_str: FIXED_POI_ID_STR, // 使用固定值
            mediumSrc1: "0c3bfd35279b4140b3bd8ecbc41301d6",
            outActivityId: "6",
            p: FIXED_P_VALUE,
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
    };

    // --- 4. 发起请求 ---
    try {
        const fetchOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(bodyObject),
            redirect: 'manual' // 避免自动跟随重定向导致信息丢失
        };

        const response = await fetch(API_URL, fetchOptions);
        const responseText = await response.text();
        
        logBuffer.push(`--- API Request Status ---`);
        logBuffer.push(`Status: ${response.status}`);
        logBuffer.push(`Status Text: ${response.statusText}`);
        
        // 记录关键响应头（例如：是否有重定向、服务器类型）
        logBuffer.push(`Response Headers: ${JSON.stringify(Object.fromEntries(response.headers))}`);

        // 记录响应体的前 1000 个字符
        logBuffer.push(`Response Body (Head 1000): ${responseText.substring(0, 1000)}...`);

        // 如果成功 (200 OK)，尝试解析 JSON
        if (response.ok) {
            try {
                const jsonResponse = JSON.parse(responseText);
                logBuffer.push(`Coupon Amount: ${jsonResponse.data?.infos[0]?.giftInfo?.coupon_amount || 'N/A'}`);
            } catch (e) {
                logBuffer.push(`Warning: Failed to parse JSON body. Error: ${e.message}`);
            }
        }
        
        return new Response(JSON.stringify({
            message: `Single request test completed. Status: ${response.status}`,
            log: logBuffer
        }, null, 2), {
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
        });

    } catch (error) {
        logBuffer.push(`FATAL FETCH ERROR: ${error.message}`);
        return new Response(JSON.stringify({ 
            error: 'Worker Runtime Error', 
            detail: error.message,
            log: logBuffer
        }, null, 2), { 
            status: 500,
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
        });
    }
}
