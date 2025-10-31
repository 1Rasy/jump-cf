const API_URL = "https://offsiteact.meituan.com/act/ge/queryPoiByRecallBiz?yodaReady=h5&csecplatform=4&csecversion=4.1.1";
// P 值已在 Header 和 Body 中写死为 "1016502508465025024"

/**
 * 提取关键信息 (优惠券金额) 的逻辑
 * @param {object} data - API 响应的 JSON 对象
 * @returns {string} 提取到的优惠券金额，如果不存在则返回 '无'
 */
function extractCouponAmount(data) {
    let couponAmount = '无';

    // 您的提取逻辑
    if (data && data.data && data.data.infos && data.data.infos.length > 0) {
        const firstInfo = data.data.infos[0];
        if (firstInfo.giftInfo && firstInfo.giftInfo.coupon_amount != null) {
            couponAmount = firstInfo.giftInfo.coupon_amount.toString();
        }
    }
    return couponAmount;
}

/**
 * 处理单个商家的 KV 读取、API 请求和 KV 写入
 * @param {string} shopName - KV Key (商家名称)
 * @param {string} poi_id_str - KV Value (身份码)
 * @param {Array<string>} logBuffer - 用于存储日志的数组
 * @returns {object} 包含处理结果的对象
 */
async function processShopData(shopName, poi_id_str, logBuffer) {
    const now = Date.now(); // 动态时间戳，用于 mtgsig.a2
    const fixedPValue = "1016502508465025024";

    // --- 1. 动态生成 Referer (嵌入 poi_id_str) ---
    // 根据最新抓包数据，Referer 中包含 poi_id_str
    const referer = `https://offsiteact.meituan.com/web/hoae/collection_waimai_v8/index.html?pageSrc2=0c3bfd35279b4140b3bd8ecbc41301d6&pageSrc1=CPS_SELF_OUT_SRC_H5_LINK&pageSrc3=e15d0d4258004ba5b44c1c85e4db4084&scene=CPS_SELF_SRC&rootPvId=0e2008a4-cafa-41c1-9c14-2b1d0bd92c4b&activityId=6&poi_id_str=${poi_id_str}&mediumSrc1=0c3bfd35279b4140b3bd8ecbc41301d6&outActivityId=6&p=${fixedPValue}&mediaPvId=dafkdsajffjafdfs&mediaUserId=10086&bizId=0c3bfd35279b4140b3bd8ecbc41301d6&callback=jsonpWXLoader&poiId=-100`;

    // --- 2. 构造完整的 Headers ---
    const mtgsigObject = {
        a1: "1.2",
        a2: now, // 动态时间戳
        a3: "z53wyy01xv7u550x161z50x625uwuyvw80328zu4v2687958u380u3v0",
        a5: "ATfLIFpacz+vv//e5l7miU1e/rmDWdybEPYA+Br0z1gFXJbIv+5RaVU9Yv4NCZV/ax2UM8F+BRWENrypvVdJyII8SgkBat3qlLYfSN9AFQKqNGLkP2GzXKZXGCm0gZ==", // 更新
        a6: "h1.9TGmgkIok7Z/iFN6TFOvr+U//V899TXJ7gkqIzsCUQvfuv8CL8ijYg+JWirC2I8M2BfBgvORoaOmvVGete3Pakd8EmZ2PL4tmsZmg2/b+C7zXJ+biOqrDON5B55rKjy1YiV2YMA77/4bbz8rAMcmwtst0QNyLnTNOMP22XS9P5Jzbnbb2oBcItf5R8C9tm7h0BqFohnxphihe7oqflBGAbtm3uiyCsGFLd2GG1eeEBic=", // 更新
        a8: "5959fb0a47997a810e810ab4c5803622", // 更新
        a9: "4.1.1,7,22", // 更新
        a10: "ac", // 更新
        x0: 4,
        d1: "69b05e8e0028a2cf6b031a336998fc4c" // 更新
    };
    
    // Cookie 格式化为字符串 (基于您提供的最新数据)
    const cookieString = "WEBDFPID=z53wyy01xv7u550x161z50x625uwuyvw80328zu4v2687958u380u3v0-1762028463798-1745664039919UGIKMYI868c0ee73ab28e1d0b03bc83148500061008; _lxsdk_s=19a3bee48b8-a60-86c-838%7C%7C7; logan_session_token=p30097ad0h65azsxtbsv; utm_source_rg=AM%25e20O2O2%25506; wm_ado_ge_e_k=yV9z57djWtciJhM4%2FQQykpF%2B6V03YdJ%2F38pS4kj0owizOSzW5WaJY7SOvw4o%2BVpK; iuuid=77497BDC4901C49D5E90A1F9DF96F645B98296AC9AFBD28C9BF3A93155DE0C39; wm_ado_ge_x=2QIEE%2BVvVKxpBXOe%2BAR86mRXV%2BdSNRpkhVmxK1Ms3zfT6ivprLZ7LTFctmazeQI1tIxv92KMQtDrhq86RpiC4ccipLut3jn63FoqfSWCXU%2FJG1zWE0ReHlRLEcyg47mZime3DqC03pOK3Tvw3EFhNlqhX6lkd%2BsekQsFsGFWu1VfEy0wX7gu57C8ASgiAnyfS3UAqhhvmOrL3%2Bl3wc973zP3ejTbL9biQU9Xz%2B2lLIw%3D; com.sankuai.wmdadoutsite.fe_random=_63.0; mt_c_token=AgFbJo6SxK3DpJcpMM3P48ZCjDiQGXRFWL6GGnp4VgdzaZirz_fjU4upZxr1GHH_j4u0GXa54vWAMAAAAABKKwAAgCmL6cqO3noU6uiixfwKWUGxfCViu8uMgsGSq2CVW6N5yKGLFf7D2Pm-fw8ZldMM; oops=AgFbJo6SxK3DpJcpMM3P48ZCjDiQGXRFWL6GGnp4VgdzaZirz_fjU4upZxr1GHH_j4u0GXa54vWAMAAAAABKKwAAgCmL6cqO3noU6uiixfwKWUGxfCViu8uMgsGSq2CVW6N5yKGLFf7D2Pm-fw8ZldMM; token=AgFbJo6SxK3DpJcpMM3P48ZCjDiQGXRFWL6GGnp4VgdzaZirz_fjU4upZxr1GHH_j4u0GXa54vWAMAAAAABKKwAAgCmL6cqO3noU6uiixfwKWUGxfCViu8uMgsGSq2CVW6N5yKGLFf7D2Pm-fw8ZldMM; userId=2611035973; _lxsdk_cuid=19671af5c41c8-00002ff28e816c-7c6f3d58-505c8-19671af5c41c8; _lxsdk=77497BDC4901C49D5E90A1F9DF96F645B98296AC9AFBD28C9BF3A93155DE0C39";


    const headers = {
        // 将 Headers 重新排序并使用最新值
        'mtgsig': JSON.stringify(mtgsigObject),
        'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_0_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/141.0.7390.96 Mobile/15E148 Safari/604.1',
        'accept-encoding': 'gzip, deflate, br',
        'sec-fetch-dest': 'empty',
        'content-type': 'application/json;charset=utf-8',
        'accept': '*/*',
        'sec-fetch-mode': 'cors',
        'cookie': cookieString, 
        'referer': referer, // 动态 Referer
        'priority': 'u=3, i',
        'sec-fetch-site': 'same-origin',
        'accept-language': 'zh-CN,zh-Hans;q=0.9',
        'origin': 'https://offsiteact.meituan.com',
        // 'content-length' 不需要，fetch API 会自动处理
    };

    // --- 3. 构造 Body (嵌入 poi_id_str) ---
    const bodyObject = {
        lat: 22.980764, // 使用最新抓包的坐标
        lon: 113.103541, // 使用最新抓包的坐标
        geoType: "GCJ02",
        geoSource: "network",
        geoAccuracy: 500,
        mediumParams: {
            pageSrc2: "0c3bfd35279b4140b3bd8ecbc41301d6",
            pageSrc1: "CPS_SELF_OUT_SRC_H5_LINK",
            pageSrc3: "e15d0d4258004ba5b44c1c85e4db4084",
            scene: "CPS_SELF_SRC",
            activityId: "6",
            poi_id_str: poi_id_str, // 动态 poi_id_str
            mediumSrc1: "0c3bfd35279b4140b3bd8ecbc41301d6",
            outActivityId: "6",
            p: fixedPValue, // 固定 P 值
            mediaPvId: "dafkdsajffjafdfs",
            mediaUserId: "10086",
            bizId: "0c3bfd35279b4140b3bd8ecbc41301d6",
            callback: "jsonpWXLoader",
            poiId: "-100"
        },
        appContainer: "UNKNOW",
        rootPvId: "0e2008a4-cafa-41c1-9c14-2b1d0bd92c4b",
        pagePvId: "8e2aaa48-20a1-46b1-a4b2-cdd21e9a3bfc", // 更新
        pageSessionId: "0f3b463a-cd60-4767-a344-67346c2e654e", // 更新
        outerPvId: "",
        contentPvId: "",
        recallBizId: "cpsEverDayCoupon", // 更新
        pageNo: 1,
        hasMore: true,
        phone: "",
        channelType: "SELF",
        riskParams: { fpPlatform: 5 }
    };

    // --- 4. 发起请求、解析与 KV 写入 ---
    try {
        const fetchOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(bodyObject),
            redirect: 'follow'
        };

        logBuffer.push(`--- Shop: ${shopName} ---`);
        logBuffer.push(`POI_ID: ${poi_id_str}`);

        const response = await fetch(API_URL, fetchOptions);
        const responseText = await response.text();

        // 打印响应体的前100位，用于验证
        logBuffer.push(`API Response (Head 100): ${responseText.substring(0, 100)}...`);

        if (!response.ok) {
            logBuffer.push(`Error: API Request failed with status ${response.status}`);
            return {
                shopName,
                status: 'Error',
                message: `API Request failed with status: ${response.status}`,
            };
        }

        const jsonResponse = JSON.parse(responseText);
        const couponAmount = extractCouponAmount(jsonResponse);

        // 构造新的 Key/Value 并写入 SHOP KV 库
        const newKey = `${shopName} ${couponAmount}`;
        const newValue = poi_id_str;

        await SHOP.put(newKey, newValue);

        // 记录写入日志
        logBuffer.push(`KV Write Success: Key="${newKey}", Value="${newValue}"`);

        return {
            shopName,
            status: 'Success',
            poi_id_str,
            couponAmount,
            shopKeyWritten: newKey
        };

    } catch (error) {
        logBuffer.push(`Exception: ${error.message}`);
        return {
            shopName,
            status: 'Exception',
            message: error.message,
        };
    }
}


// HTTP 触发模式的 Worker 入口
addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    const results = [];
    const logBuffer = [];
    let list_cursor;

    logBuffer.push('--- Starting KV Processing ---');

    try {
        // 确保 Worker 不超时，限制每批次处理数量
        while (true) {
            const list = await SJQ.list({ limit: 50, cursor: list_cursor });

            if (list.keys.length === 0) {
                break;
            }

            // 批量获取 Key 对应的 Value (poi_id_str)
            const getPromises = list.keys.map(keyInfo => SJQ.get(keyInfo.name));
            const poi_id_strs = await Promise.all(getPromises);

            // 构造请求任务，并传入 logBuffer
            const shopPromises = list.keys.map((keyInfo, index) =>
                processShopData(keyInfo.name, poi_id_strs[index], logBuffer)
            );

            const batchResults = await Promise.all(shopPromises);
            results.push(...batchResults);

            if (list.list_complete) {
                break;
            }
            list_cursor = list.cursor;
        }

        const successCount = results.filter(r => r.status === 'Success').length;
        const totalCount = results.length;
        logBuffer.push(`--- Finished Processing ---`);
        logBuffer.push(`Total Shops: ${totalCount}, Successful Writes: ${successCount}`);

        return new Response(JSON.stringify({
            message: `KV 处理完成。总计：${totalCount} 个商家，成功写入 SHOP KV：${successCount} 个。`,
            log: logBuffer,
            summary: results
        }, null, 2), {
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
        });

    } catch (error) {
        logBuffer.push(`FATAL Worker Error: ${error.message}`);
        return new Response(JSON.stringify({
            error: 'Worker 运行时错误',
            detail: error.message,
            log: logBuffer
        }, null, 2), {
            status: 500,
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
        });
    }
}
