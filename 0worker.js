const API_URL = "https://offsiteact.meituan.com/act/ge/queryPoiByRecallBiz?yodaReady=h5&csecplatform=4&csecversion=4.1.1";

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
    
    // 1. 动态生成 Referer 
    const referer = `https://offsiteact.meituan.com/web/hoae/collection_waimai_v8/index.html?pageSrc2=0c3bfd35279b4140b3bd8ecbc41301d6&pageSrc1=CPS_SELF_OUT_SRC_H5_LINK&pageSrc3=e15d0d4258004ba5b44c1c85e4db4084&scene=CPS_SELF_SRC&rootPvId=0e2008a4-cafa-41c1-9c14-2b1d0bd92c4b&activityId=6&poi_id_str=${poi_id_str}&mediumSrc1=0c3bfd35279b4140b3bd8ecbc41301d6&outActivityId=6&p=1016502508465025024&mediaPvId=dafkdsajffjafdfs&mediaUserId=10086&bizId=0c3bfd35279b4140b3bd8ecbc41301d6&callback=jsonpWXLoader&poiId=-100`;

    // 2. 构造完整的 Headers
    const mtgsigObject = { 
        a1: "1.2", 
        a2: now, // 动态时间戳
        a3: "z53wyy01xv7u550x161z50x625uwuyvw80328zu4v2687958u380u3v0-1761257513891-1745664039919UGIKMYI868c0ee73ab28e1d0b03bc83148500061008", 
        a5: "oVjAOcgNjj6drqWh0Ubeyg4KnNi785b5e/t6eKkotxd350Tc3Vi86EzVWQhAMkrJ37bU7EJE4Nb/xv36wzkdq4bU0mZ8mEZ1XLes3W4K691QgiSjpcTgL1mAMqwORW==", 
        a6: "h1.9gWg/ByL6/Q+dkFaG52FW+tgwc3rraYxeTD9Vs6LQUpEzdcQ+APN9Xyy/w9Er0olxFSqAMXz+oCrASX0gIPpm4cPDGeBY0UbNJOzmydKSBAKOt6c1YHQyl/fZYtMWkH+wzXsANLR/c88rvspt+RemdcNrcis+SDhKS3itQVkJvC/YJhXgRV937wIf3TSc+uoKoVesVD8sVhgvC3FGeQ7M51+z+G1piZkFFtlXPVQLp8g=", 
        a8: "470b09d42a36b46fae88765f3ad8858f", 
        a9: "4.1.1,7,195", 
        a10: "28", 
        x0: 4, 
        d1: "6f961e29be5a92d1eb8b5a5dd1cc8cf6" 
    };

    const headers = {
        'origin': 'https://offsiteact.meituan.com',
        'accept-encoding': 'gzip, deflate, br',
        'accept': '*/*',
        'referer': referer, // 动态 Referer
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'accept-language': 'zh-CN,zh-Hans;q=0.9',
        
        'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_0_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/141.0.7390.96 Mobile/15E148 Safari/604.1',
        'content-type': 'application/json;charset=utf-8'
    };

    // 3. 构造 Body (p 值固定，poi_id_str 动态)
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
            p: "1016502508465025024",
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

    try {
        const fetchOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body),
            redirect: 'follow' 
        };
        
        logBuffer.push(`--- Shop: ${shopName} ---`);
        logBuffer.push(`POI_ID: ${poi_id_str}`);

        const response = await fetch(API_URL, fetchOptions);
        
        // 读取响应体，用于日志和解析
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

        const jsonResponse = JSON.parse(responseText); // 使用已读取的文本
        const couponAmount = extractCouponAmount(jsonResponse);

        // 4. 构造新的 Key/Value 并写入 SHOP KV 库
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
    const logBuffer = []; // 存储所有日志信息
    let list_cursor; 

    logBuffer.push('--- Starting KV Processing ---');

    try {
        // 循环遍历 SJQ KV 库
        while (true) {
            // 1. 列出当前批次的 Key
            const list = await SJQ.list({ limit: 50, cursor: list_cursor }); // 限制批次大小以防超时
            
            // 2. 批量获取 Key 对应的 Value (poi_id_str)
            const getPromises = list.keys.map(keyInfo => SJQ.get(keyInfo.name));
            const poi_id_strs = await Promise.all(getPromises);

            // 3. 构造请求任务，并传入 logBuffer
            const shopPromises = list.keys.map((keyInfo, index) => 
                processShopData(keyInfo.name, poi_id_strs[index], logBuffer)
            );

            // 等待所有 API 请求完成
            const batchResults = await Promise.all(shopPromises);
            results.push(...batchResults);

            // 检查是否还有更多数据
            if (list.list_complete) {
                break;
            }
            list_cursor = list.cursor;
        }

        // 汇总结果
        const successCount = results.filter(r => r.status === 'Success').length;
        const totalCount = results.length;
        logBuffer.push(`--- Finished Processing ---`);
        logBuffer.push(`Total Shops: ${totalCount}, Successful Writes: ${successCount}`);


        // 最终返回给用户的响应
        return new Response(JSON.stringify({
            message: `KV 处理完成。总计：${totalCount} 个商家，成功写入 SHOP KV：${successCount} 个。`,
            log: logBuffer, // 返回所有记录的日志
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
