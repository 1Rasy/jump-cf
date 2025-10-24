export default {
  async fetch(request) {
    const url = "https://offsiteact.meituan.com/act/ge/queryPoiByRecallBiz";
    const start = Date.now();
    const res = await fetch(url, { method: "HEAD" }); // 只测响应头
    const ms = Date.now() - start;

    return new Response(`Cloudflare 节点访问美团耗时：${ms} ms`, {
      headers: { "content-type": "text/plain;charset=utf-8" },
    });
  }
}