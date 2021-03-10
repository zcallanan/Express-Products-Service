import updateAvailability from "../db/update-availability";
import { getResult, getClient } from "./redis-client";
import {
  CACHE_TIMER,
  TEST_CACHE_TIMER,
  REDIS_URL,
  KEY_EVENT_SET,
  PRODUCT_LIST,
  IGNORE_LIST,
  NODE_ENV,
} from "./constants";
import redis from "redis";
import { RedisClient } from "redis";
const subscriber: RedisClient = redis.createClient({ url: REDIS_URL });
const client: RedisClient = getClient();

const subscriberInit = (): RedisClient => {
  const listString: string =
    NODE_ENV === "test" ? "manufacturer-list_test" : "manufacturer-list";
  const updateString: string =
    NODE_ENV === "test" ? "update-ready_test" : "update-ready";
  const cache: number = NODE_ENV === "test" ? TEST_CACHE_TIMER : CACHE_TIMER;
  // Redis subscriber to determine when to update availability column
  subscriber.on("pmessage", async (pattern, channel, message) => {
    console.log(
      "(" +
        pattern +
        ")" +
        " client received message on " +
        channel +
        ": " +
        message
    );

    if (channel === KEY_EVENT_SET && !IGNORE_LIST.includes(message)) {
      const manufacturerResult: string | null = await getResult(listString);
      const manufacturers: StringList | undefined = manufacturerResult
        ? JSON.parse(manufacturerResult)
        : undefined;
      const updateResult: string | null = await getResult(updateString);
      let updateReady: StringList | undefined = updateResult
        ? JSON.parse(updateResult)
        : undefined;
      if (manufacturers) {
        if (manufacturers[listString].includes(message)) {
          if (!updateReady) {
            updateReady = { [updateString]: [message] };
            console.log("init updateReady:", updateReady);
          } else if (!updateReady[updateString].includes(message)) {
            updateReady[updateString].push(message);
            console.log("push", updateReady);
          }
          client.set(updateString, JSON.stringify(updateReady), "EX", cache);
        }
        if (updateReady) {
          if (
            message === updateString &&
            updateReady[updateString].length ===
              manufacturers[listString].length
          ) {
            console.log(
              "Update is a go",
              manufacturers[listString],
              updateReady[updateString]
            );
            PRODUCT_LIST.forEach((product, index) =>
              setTimeout(
                updateAvailability,
                100 * index,
                manufacturers[listString],
                product
              )
            );
          }
        }
      }
    }
  });
  subscriber.psubscribe("__key*__:*");
  return subscriber;
};

export default subscriberInit;
