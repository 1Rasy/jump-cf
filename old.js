/**
 * Cloudflare Worker 脚本
 * 从 KV 命名空间 SJQ 中读取所有键值对，并生成一个包含跳转按钮的 HTML 页面。
 * * 优化了样式：简约、固定宽度（约20汉字）、适配手机，**新增夜间模式适配**。
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
            const listResponse = await env.SJQ.list();
            const keys = listResponse.keys;

            let htmlContent = '';
            
            // 检查是否有数据
            if (keys.length === 0) {
                htmlContent += '<p>KV 命名空间中没有找到数据。</p>';
            } else {
                // 遍历所有键，获取对应的值，并生成按钮
                for (const keyInfo of keys) {
                    const key = keyInfo.name;
                    
                    // 获取对应的 value
                    const value = await env.SJQ.get(key, 'text'); 

                    if (value) {
                        // 注意：这里仅为示例 URL，保持不变
                        const targetUrl = `https://offsiteact.meituan.com/web/hoae/collection_waimai_v8/index.html?poi_id_str=${key}&mediumSrc1=0c3bfd35279b4140b3bd8ecbc41301d6&outActivityId=6&p=1016502508465025024&mediaPvId=dafkdsajffjafdfs&mediaUserId=10086&bizId=0c3bfd35279b4140b3bd8ecbc41301d6&callback=jsonpWXLoader&poiId=-100`;
                        const buttonName = value;

                        // 生成跳转按钮的 HTML (使用 <a> 标签并应用简约样式)
                        htmlContent += `
                            <div class="link-item">
                                <a href="${targetUrl}" target="_blank" class="button">
                                    ${buttonName}
                                </a>
                            </div>
                        `;
                    }
                }
            }


            // 构建完整的 HTML 页面
            const html = `
                <!DOCTYPE html>
                <html lang="zh">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0"> 
                    <title>商家券</title>
                    <style>
                        /* --- 默认（浅色）模式样式 --- */
                        body { 
                            font-family: sans-serif;
                            padding: 20px;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            margin: 0;
                            background-color: #fff; /* 默认浅色背景 */
                            color: #333; /* 默认深色文字 */
                        }

                        h1 {
                            margin-bottom: 30px;
                        }

                        .link-item {
                            width: 100%;
                            display: flex;
                            justify-content: center;
                            margin-bottom: 15px;
                        }
                        
                        .button {
                            /* 按钮基础样式 */
                            display: block; 
                            width: 90%;
                            max-width: 300px;
                            padding: 12px 10px;
                            
                            /* 浅色模式外观 */
                            background-color: #f0f0f0; /* 浅灰色背景 */
                            color: #333; /* 默认深色文字 */
                            text-align: left;
                            text-decoration: none;
                            border-radius: 8px;
                            border: 1px solid #ccc; /* 细边框 */
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                            
                            font-size: 16px; 
                            line-height: 1.5;
                            word-wrap: break-word;
                            white-space: normal;

                            /* 触摸反馈 */
                            transition: background-color 0.2s, transform 0.1s;
                        }

                        .button:hover {
                            background-color: #e0e0e0;
                        }

                        .button:active {
                            background-color: #d0d0d0;
                            transform: scale(0.98);
                        }

                        /* 针对小屏幕的微调 */
                        @media (max-width: 600px) {
                            .button {
                                width: 95%;
                            }
                        }

                        /* --- 夜间模式适配（使用 prefers-color-scheme）--- */
                        @media (prefers-color-scheme: dark) {
                            body {
                                background-color: #121212; /* 深色背景 */
                                color: #e0e0e0; /* 浅色文字 */
                            }

                            .button {
                                /* 夜间模式按钮样式 */
                                background-color: #272727; /* 比背景稍浅的深色 */
                                color: #e0e0e0; /* 浅色文字 */
                                border: 1px solid #444; /* 深色细边框 */
                                box-shadow: 0 2px 4px rgba(0,0,0,0.4); /* 更明显的阴影 */
                            }

                            .button:hover {
                                background-color: #333333; /* 悬停时颜色变化 */
                            }

                            .button:active {
                                background-color: #444444;
                                transform: scale(0.98);
                            }
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