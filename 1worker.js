const MAX_CONCURRENT_REQUESTS = 12; // 并发删除上限

export default {
  // 手动触发接口
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === "/clear") {
      try {
        await clearShopKV(env);
        return new Response("✅ 已清空 SHOP KV", { status: 200 });
      } catch (err) {
        return new Response("❌ 清空失败：" + err.toString(), { status: 500 });
      }
    }
    return new Response("访问 /clear 触发清空 SHOP KV", { status: 200 });
  },
};

// 清空 SHOP KV
async function clearShopKV(env) {
  const list = await env.SHOP.list({ limit: 1000 });
  if (!list.keys || list.keys.length === 0) {
    console.log("📭 SHOP KV 本为空，无需清理");
    return;
  }

  console.log(`🧹 正在清空 SHOP KV，共 ${list.keys.length} 条`);
  const executing = [];

  for (const k of list.keys) {
    const p = env.SHOP.delete(k.name);
    executing.push(p);

    if (executing.length >= MAX_CONCURRENT_REQUESTS) {
      await Promise.race(executing);
      // 清理已完成的 promise
      for (let i = executing.length - 1; i >= 0; i--) {
        if (executing[i].resolved) executing.splice(i, 1);
      }
    }
  }

  await Promise.all(executing);
  console.log(`✅ SHOP KV 已清空，共删除 ${list.keys.length} 条`);
}
