/**
 * Cloudflare Worker 脚本
 * 从 KV 命名空间 SJQ 中读取所有键值对，并生成一个包含跳转按钮的 HTML 页面。
 * * 优化了样式：简约、固定宽度（约20汉字）、适配手机。
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
                        const targetUrl = `https://abc.com/${key}`;
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
                        /* 手机优先的简约样式 */
                        body { 
                            font-family: sans-serif; /* 使用客户端默认字体 */
                            padding: 20px;
                            display: flex;
                            flex-direction: column;
                            align-items: center; /* 按钮居中 */
                            margin: 0;
                        }

                        h1 {
                            margin-bottom: 30px;
                        }

                        .link-item {
                            width: 100%; /* 允许项目占据全部宽度 */
                            display: flex;
                            justify-content: center; /* 确保按钮在 flex 容器中居中 */
                            margin-bottom: 15px;
                        }
                        
                        .button {
                            /* 按钮基础样式：固定宽度，自适应高度 */
                            display: block; 
                            width: 90%; /* 在手机上占据大部分宽度 */
                            max-width: 300px; /* 限制最大宽度，约等于20个汉字（取决于字体大小）*/
                            padding: 12px 10px;
                            
                            /* 简约外观 */
                            background-color: #f0f0f0; /* 浅灰色背景 */
                            color: #333; /* 默认深色文字 */
                            text-align: center;
                            text-decoration: none; /* 移除下划线 */
                            border-radius: 8px; /* 圆角 */
                            border: 1px solid #ccc; /* 细边框 */
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* 轻微阴影 */
                            
                            /* 保证文字不被强制定义 */
                            font-size: 16px; 
                            line-height: 1.5;
                            word-wrap: break-word; /* 确保长文字能够换行 */
                            white-space: normal; /* 正常换行 */

                            /* 触摸反馈 */
                            transition: background-color 0.2s, transform 0.1s;
                        }

                        .button:hover {
                            background-color: #e0e0e0;
                        }

                        .button:active {
                            background-color: #d0d0d0;
                            transform: scale(0.98); /* 点击时轻微缩小 */
                        }

                        /* 针对小屏幕的微调，确保按钮宽度合适 */
                        @media (max-width: 600px) {
                            .button {
                                width: 95%; /* 小屏幕上更宽一点 */
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
