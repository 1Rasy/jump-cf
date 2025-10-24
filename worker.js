export default {
  async fetch(request) {
    const startAll = Date.now();

    // 测 Cloudflare 当前节点信息
    const node = request.cf?.colo || "未知";
    const country = request.cf?.country || "未知";
    const city = request.cf?.city || "未知";

    // 测访问美团接口延迟
    const url = "https://offsiteact.meituan.com/act/ge/queryPoiByRecallBiz";
    const startFetch = Date.now();
    let fetchMs = 0;
    let status = "失败";
    try {
      const res = await fetch(url, { method: "HEAD" });
      fetchMs = Date.now() - startFetch;
      status = res.status;
    } catch (err) {
      fetchMs = Date.now() - startFetch;
      status = "出错";
    }

    const total = Date.now() - startAll;

    const text = `
🌏 Cloudflare Worker 网络测速
---------------------------------
节点代号：${node}
国家/地区：${country}
城市：${city}

🎯 目标接口：${url}
响应状态：${status}
访问耗时：${fetchMs} ms

🧭 Worker 总耗时（含计算）：${total} ms
---------------------------------
说明：CPU time 与网络延迟无关，主要取决于 Cloudflare 节点到目标站点的网络质量。
    `.trim();

    return new Response(text, {
      headers: { "content-type": "text/plain;charset=utf-8" },
    });
  }
}