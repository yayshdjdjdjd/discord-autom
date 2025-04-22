const { DISCORD_BOT_TOKEN } = process.env;  // Botのトークン

// Discord APIのエンドポイント
const DISCORD_API = "https://discord.com/api/v10/users/@me";

// リクエストの検証
async function verifyDiscordToken(token) {
  const response = await fetch(DISCORD_API, {
    method: 'GET',
    headers: {
      'Authorization': `Bot ${DISCORD_BOT_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error("Invalid Discord token");
  }

  return await response.json();
}

// Workerのリクエスト処理
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const params = url.searchParams;
  
  const token = params.get('discord_token');
  
  if (!token) {
    return new Response("Token is missing", { status: 400 });
  }

  try {
    // トークン検証
    const user = await verifyDiscordToken(token);
    return new Response(`Welcome, ${user.username}!`, { status: 200 });
  } catch (error) {
    return new Response("Authorization failed", { status: 403 });
  }
}
