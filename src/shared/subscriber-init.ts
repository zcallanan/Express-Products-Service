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
import { StringList } from "../types";

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

    if (channel === KEY_EVENT_SET && !IGNORE_LIST.includes(message)) { // Something is set
      // Check update-ready
      const updateResult: string | null = await getResult(updateString);
      let updateReady: StringList | undefined = updateResult
        ? JSON.parse(updateResult)
        : undefined;
      const manufacturerResult: string | null = await getResult(listString);
      const manufacturers: StringList | undefined = manufacturerResult
        ? JSON.parse(manufacturerResult)
        : undefined;

      // Create update-ready
      if (!updateReady) {
        console.log("Initialize updateReady");
        updateReady = { [updateString]: [] };
        client.set(updateString, JSON.stringify(updateReady), "EX", cache);
      } else if (
        manufacturers &&
        message === updateString &&
        updateReady[updateString].length === manufacturers[listString].length
      ) {
        // Call update availability for all products
        console.log(
          "Update is a go",
          manufacturers[listString],
          updateReady[updateString]
        );
        PRODUCT_LIST.forEach(function (product, index) {
          return setTimeout(
            updateAvailability,
            100 * index,
            manufacturers[listString],
            product
          );
        });
      }

      if (manufacturers) {
        // Push message to update-ready hash
        if (manufacturers[listString].includes(message)) {
          console.log("Push", message);
          updateReady[updateString].push(message);
          client.set(updateString, JSON.stringify(updateReady), "EX", cache);
          manufacturers[listString].forEach((manufacturer) => {
            if (manufacturer !== message) {
              // Push other manufacturers to hash
              const manResult = getResult(manufacturer);
              manResult.then((x) => {
                if (x && updateReady) {
                  updateReady[updateString].push(manufacturer);
                  client.set(
                    updateString,
                    JSON.stringify(updateReady),
                    "EX",
                    cache
                  );
                }
              });
            }
          });
        }
      }
    }
  });
  subscriber.psubscribe("__key*__:*");
  return subscriber;
};

export default subscriberInit;
