/**
 * Cloudflare Worker 脚本
 * 从 KV 命名空间 SJQ 中读取所有键值对，并生成一个包含跳转按钮的 HTML 页面。
 *
 * 需要在 Worker 设置中绑定一个 KV 命名空间，命名为 'SJQ'。
 *
 * @param {Request} request 传入的请求对象
 * @param {Env} env 环境变量（包含 KV 绑定）
 * @returns {Response} 包含按钮的 HTML 响应
 */
export default {
    async fetch(request, env) {
        // 检查 SJQ KV 绑定是否存在
        if (!env.SJQ) {
            return new Response("错误：未找到名为 'SJQ' 的 KV 命名空间绑定。", { status: 500 });
        }

        try {
            // 1. 从 SJQ KV 命名空间中获取所有键
            // list() 默认只返回 key，但我们同时也需要 value，所以我们将使用 list() 获取所有 key，然后用 get() 循环获取 value。
            // 另一种方式是使用 list() 获取 key，然后期望 key 本身就是有意义的，但这与你的要求“取 value 来作为名字”不符。
            
            const listResponse = await env.SJQ.list();
            const keys = listResponse.keys;

            let htmlContent = '<h1>链接列表</h1>';
            
            // 检查是否有数据
            if (keys.length === 0) {
                htmlContent += '<p>KV 命名空间中没有找到数据。</p>';
            } else {
                // 2. 遍历所有键，获取对应的值，并生成按钮
                for (const keyInfo of keys) {
                    const key = keyInfo.name;
                    
                    // 获取对应的 value
                    // 如果 key 不存在或者 value 很大，这里可能会有性能问题。
                    // 假设 value 只是短文本（按钮名称）。
                    const value = await env.SJQ.get(key, 'text'); 

                    if (value) {
                        // 键用于构建 URL: 
                        const targetUrl = `https://offsiteact.meituan.com/web/hoae/collection_waimai_v8/index.html?pageSrc2=0c3bfd35279b4140b3bd8ecbc41301d6&pageSrc1=CPS_SELF_OUT_SRC_H5_LINK&pageSrc3=e15d0d4258004ba5b44c1c85e4db4084&scene=CPS_SELF_SRC&rootPvId=0e2008a4-cafa-41c1-9c14-2b1d0bd92c4b&activityId=6&poi_id_str=${key}&mediumSrc1=0c3bfd35279b4140b3bd8ecbc41301d6&outActivityId=6&p=1016502508465025024&mediaPvId=dafkdsajffjafdfs&mediaUserId=10086&bizId=0c3bfd35279b4140b3bd8ecbc41301d6&callback=jsonpWXLoader&poiId=-100`;
                        
                        // 值用于按钮名称
                        const buttonName = value;

                        // 生成跳转按钮的 HTML
                        // 使用 <a> 标签模拟按钮样式，并实现跳转
                        htmlContent += `
                            <div style="margin-bottom: 10px;">
                                <a href="${targetUrl}" target="_blank" style="
                                    display: inline-block;
                                    padding: 10px 20px;
                                    font-size: 16px;
                                    cursor: pointer;
                                    text-align: center;
                                    text-decoration: none;
                                    outline: none;
                                    color: #fff;
                                    background-color: #4CAF50;
                                    border: none;
                                    border-radius: 5px;
                                    box-shadow: 0 5px #999;
                                    transition: background-color 0.3s;
                                ">
                                    ${buttonName}
                                </a>
                            </div>
                        `;
                    }
                }
            }


            // 3. 构建完整的 HTML 页面
            const html = `
                <!DOCTYPE html>
                <html lang="zh">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>商家券</title>
                    <style>
                        body { 
                            font-family: Arial, sans-serif; 
                            display: flex; 
                            flex-direction: column; 
                            align-items: center; 
                            padding-top: 50px;
                        }
                        a:hover {
                            background-color: #3e8e41;
                        }
                        a:active {
                            background-color: #3e8e41;
                            box-shadow: 0 2px #666;
                            transform: translateY(3px);
                        }
                    </style>
                </head>
                <body>
                    ${htmlContent}
                </body>
                </html>
            `;

            // 返回 HTML 响应
            return new Response(html, {
                headers: {
                    "content-type": "text/html;charset=UTF-8",
                },
            });

        } catch (e) {
            // 捕获 KV 操作或其他错误
            return new Response(`处理请求时发生错误: ${e.message}`, { status: 500 });
        }
    },
};
