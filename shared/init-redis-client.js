const { promisify } = require("util");
const { REDIS_URL } = require("./constants.js");
const client = require("redis").createClient(REDIS_URL);
const getAsync = promisify(client.get).bind(client);

client.on("error", (error) => console.error(error));

const getResult = async (val) => {
  try {
    return await getAsync(val);
  } catch (err) {
    console.log(err);
  }
};

const getRedisValue = async (key) => {
  try {
    JSON.parse(await getResult(key));
  } catch (err) {
    console.log(err);
  }
};

module.exports = { getRedisValue, getResult, client };
