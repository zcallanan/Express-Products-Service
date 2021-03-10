import { promisify } from "util";
import { REDIS_URL } from "./constants";
import redis from "redis";
import { RedisClient } from "redis";

const client: RedisClient = redis.createClient({ url: REDIS_URL });

client.on("error", (error) => console.error(error));

const getClient = (): RedisClient => {
  return client;
};

const getAsync = promisify(client.get).bind(client);

const getResult = async (val: string): Promise<string | null> => {
  return await getAsync(val);
};

// const getRedisValue = async (key: string): Promise<StringList> => {
//   const result = await getResult(key);
//   if (result) {
//     return JSON.parse(result);
//   }
// };

// export { getRedisValue, getResult, getClient };
export { getResult, getClient };
