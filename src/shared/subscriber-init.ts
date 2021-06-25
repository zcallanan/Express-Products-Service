import redis from "redis";
import updateAvailability from "../db/update-availability";
import { getResult } from "./redis-client";
import massInsert from "../db/mass-insert";
import massUpdate from "../db/mass-update";
import {
  REDIS_URL,
  KEY_EVENT_SET,
  KEY_EVENT_APPEND,
  PRODUCT_LIST,
  ACCEPTABLE_MANUFACTURER_MESSAGES,
  ACCEPTABLE_APPEND_MESSAGES,
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
  let beaniesTriggered = 0;
  let facemasksTriggered = 0;
  let glovesTriggered = 0;
  // Redis subscriber to determine when to update availability column
  subscriber.on("pmessage", async (pattern, channel, message) => {
    console.log(`client: ${pattern} channel: ${channel} message: ${message}`);

    const manufacturerResult: string | null = await getResult(listString);
    const manufacturers: StringList | undefined = manufacturerResult
      ? JSON.parse(manufacturerResult)
      : undefined;

    if (channel === KEY_EVENT_SET && ACCEPTABLE_MANUFACTURER_MESSAGES.includes(message)) {
      if (!updateReady[updateString].includes(message)) {
        updateReady[updateString].push(message);
        console.log(`Pushed" ${message}: ${updateReady[updateString]}`);
      }
      if (
        manufacturers
        && updateReady[updateString].length === manufacturers[listString].length
      ) {
        console.log(`Update triggered: ${updateReady[updateString]} : ${manufacturers[listString]}`);
        // Give time for Insertion
        await new Promise<string>((resolve) => setTimeout(() => resolve("Done"), 100));

        PRODUCT_LIST.forEach((product, index) => setTimeout(
          updateAvailability,
          50 * index,
          manufacturers[listString],
          product,
        ));
      }
    }
    if (channel === KEY_EVENT_APPEND && ACCEPTABLE_APPEND_MESSAGES.includes(message)) {
      const tallyName: string[] = message.split("-");
      const productName = tallyName[0];
      // Get productName-tally
      const productTally: string = NODE_ENV === "test"
        ? `${productName}-tally_test`
        : `${productName}-tally`;
      let tallyString: string | null = await getResult(productTally);
      if (tallyString) {
        // Remove trailing comma
        tallyString = tallyString.slice(0, tallyString.length - 1);
        // Calculate tally count
        const tallyArray: string[] = tallyString.split(",");
        const evaluatedRows: number = tallyArray.length;
        if (evaluatedRows === 3333) {
          if (productName === "beanies" && beaniesTriggered === 0) {
            beaniesTriggered = 1;
            // Trigger mass insert and update for the product
            console.log(`Trigger for ${productName}!`);
            // Add a delay to account for Redis
            setTimeout(() => {
              massInsert(productName);
              massUpdate(productName);
            }, 3000);
          }
          if (productName === "facemasks" && facemasksTriggered === 0) {
            facemasksTriggered = 1;
            // Trigger mass insert and update for the product
            console.log(`Trigger for ${productName}!`);
            // Add a delay to account for Redis
            setTimeout(() => {
              massInsert(productName);
              massUpdate(productName);
            }, 3000);
          }
          if (productName === "gloves" && glovesTriggered === 0) {
            glovesTriggered = 1;
            // Trigger mass insert and update for the product
            console.log(`Trigger for ${productName}!`);
            // Add a delay to account for Redis
            setTimeout(() => {
              massInsert(productName);
              massUpdate(productName);
            }, 3000);
          }
        }
      }
    }
  });

  subscriber.psubscribe("__key*__:*");
  return subscriber;
};

export default subscriberInit;
