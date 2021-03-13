import redis from "redis";
import updateAvailability from "../db/update-availability";
import { getResult } from "./redis-client";
import {
  REDIS_URL,
  KEY_EVENT_SET,
  PRODUCT_LIST,
  IGNORE_LIST,
  NODE_ENV,
} from "./constants";
import { StringList } from "../types";

const subscriberInit = async (): Promise<redis.RedisClient> => {
  const subscriber: redis.RedisClient = redis.createClient({ url: REDIS_URL });
  const listString: string = NODE_ENV === "test"
    ? "manufacturer-list_test"
    : "manufacturer-list";
  const updateString: string = NODE_ENV === "test"
    ? "update-ready_test"
    : "update-ready";
  const array: string[] = [];
  const updateReady = { [updateString]: array };
  // Redis subscriber to determine when to update availability column
  subscriber.on("pmessage", async (pattern, channel, message) => {
    console.log(`client: ${pattern} channel: ${channel} message: ${message}`);

    const manufacturerResult: string | null = await getResult(listString);
    const manufacturers: StringList | undefined = manufacturerResult
      ? JSON.parse(manufacturerResult)
      : undefined;

    if (channel === KEY_EVENT_SET && !IGNORE_LIST.includes(message)) {
      if (!updateReady[updateString].includes(message)) {
        updateReady[updateString].push(message);
        console.log("Pushed", message, updateReady[updateString]);
      }
      if (
        manufacturers
        && updateReady[updateString].length === manufacturers[listString].length
      ) {
        console.log(`Update triggered: ${updateReady[updateString]} : ${manufacturers[listString]}`);
        // Give time for Insertion
        await new Promise<string>((resolve) => setTimeout(() => resolve("Done"), 100));

        PRODUCT_LIST.forEach((product, index) =>
          setTimeout(
            updateAvailability,
            50 * index,
            manufacturers[listString],
            product
          )
        );
      }
    }
  });
  subscriber.psubscribe("__key*__:*");
  return subscriber;
};

export default subscriberInit;
