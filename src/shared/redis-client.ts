import redis from "redis";
import { promisify } from "util";
import { REDIS_URL } from "./constants";

const client: redis.RedisClient = redis.createClient({ url: REDIS_URL });
client.on("error", (error) => console.error(error));
const getClient = async (): Promise<redis.RedisClient> => client;

const getAsync = promisify(client.get).bind(client);
const getResult = async (val: string): Promise<string | null> => getAsync(val);

export { getResult, getClient };
