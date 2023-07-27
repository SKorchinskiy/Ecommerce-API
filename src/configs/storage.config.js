const redis = require("redis").createClient();

async function startRedis() {
  await redis.connect();
}

module.exports = { startRedis, redis };
