export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(clearShopKV(env));
  },
};

async function clearShopKV(env) {
  try {
    const list = await env.SHOP.list({ limit: 1000 });
    let count = 0;

    for (const item of list.keys || []) {
      await env.SHOP.delete(item.name);
      count++;
    }

    console.log(`✅ 已清空 SHOP KV，共删除 ${count} 条`);
  } catch (err) {
    console.error("❌ 清空 SHOP KV 失败：", err);
  }
}
