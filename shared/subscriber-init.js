const updateAvailability = require("../db/update-availability.js");
const { getRedisValue, client } = require("./redis-client.js");
const {
  CACHE_TIMER,
  TEST_CACHE_TIMER,
  REDIS_URL,
  KEY_EVENT_SET,
  PRODUCT_LIST,
  IGNORE_LIST,
  NODE_ENV,
} = require("./constants.js");
const subscriber = require("redis").createClient(REDIS_URL);

const subscriberInit = () => {
  let updatePromise;
  let manufacturersPromise;
  const listString =
    NODE_ENV === "test" ? "manufacturer-list_test" : "manufacturer-list";
  const updateString =
    NODE_ENV === "test" ? "update-ready_test" : "update-ready";
  const cache = NODE_ENV === "test" ? TEST_CACHE_TIMER : CACHE_TIMER;
  // Redis subscriber to determine when to update availability column

  subscriber.on("pmessage", (pattern, channel, message) => {
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
      manufacturersPromise = getRedisValue(listString);
      updatePromise = getRedisValue(updateString);

      manufacturersPromise.then((manufacturers) => {
        if (manufacturers[listString].includes(message)) {
          updatePromise.then((updateReady) => {
            if (!updateReady) {
              updateReady = { [updateString]: [message] };
              console.log("init updateReady:", updateReady);
            } else {
              if (!updateReady[updateString].includes(message)) {
                updateReady[updateString].push(message);
                console.log("push", updateReady);
              }
            }
            client.set(updateString, JSON.stringify(updateReady), "EX", cache);
          });
        }
        if (message === updateString) {
          updatePromise.then((updateReady) => {
            if (
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
          });
        }
      });
    }
  });
  subscriber.psubscribe("__key*__:*");
};

module.exports = { subscriberInit, subscriber };
