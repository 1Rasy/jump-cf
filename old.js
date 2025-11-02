export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ======================
    // 1️⃣ 显示网页：按钮文字=值，按钮链接=键
    // ======================
    if (url.pathname === "/") {
      const list = await env.SJQ.list();
      let html = `
        <!DOCTYPE html>
        <html lang="zh">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>商家券</title>
          <style>
            body {
              font-family: system-ui, sans-serif;
              background: #f7f7f8;
              padding: 30px;
              text-align: center;
            }
            h1 {
              margin-bottom: 20px;
              color: #333;
            }
            .button {
              display: inline-block;
              background: #0078ff;
              color: white;
              border: none;
              padding: 12px 20px;
              margin: 8px;
              border-radius: 10px;
              text-decoration: none;
              font-size: 16px;
              transition: background 0.2s ease;
            }
            .button:hover {
              background: #005fd4;
            }
          </style>
        </head>
        <body>
      
      `;

      for (const k of list.keys) {
        const key = k.name; // 链接
        const value = await env.SJQ.get(key); // 按钮文字
        if (!value) continue;
         
        html += `<a href="https://offsiteact.meituan.com/web/hoae/collection_waimai_v8/index.html?pageSrc2=0c3bfd35279b4140b3bd8ecbc41301d6&pageSrc1=CPS_SELF_OUT_SRC_H5_LINK&pageSrc3=e15d0d4258004ba5b44c1c85e4db4084&scene=CPS_SELF_SRC&rootPvId=0e2008a4-cafa-41c1-9c14-2b1d0bd92c4b&activityId=6&poi_id_str+${key}&mediumSrc1=0c3bfd35279b4140b3bd8ecbc41301d6&outActivityId=6&p=1016502508465025024&mediaPvId=dafkdsajffjafdfs&mediaUserId=10086&bizId=0c3bfd35279b4140b3bd8ecbc41301d6&callback=jsonpWXLoader&poiId=-100
    " class="button" target="_blank">${value}</a>`;
      }

      html += `
          <p style="margin-top:40px;color:#777;font-size:14px;">共 ${list.keys.length} 个项目</p>
        </body></html>
      `;

      return new Response(html, {
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }

    // ======================
    // 2️⃣ 读取单个键的值
    // ======================
    if (url.pathname === "/read") {
      const key = url.searchParams.get("key");
      if (!key) return new Response("缺少 key 参数", { status: 400 });
      const value = await env.SJQ.get(key);
      return new Response(value ?? "未找到该键");
    }

    // ======================
    // 3️⃣ 其他路径
    // ======================
    return new Response("Not Found", { status: 404 });
  },
};

       
