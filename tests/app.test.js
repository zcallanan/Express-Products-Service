const http = require("http");
const { app } = require("../index.js");
const server = http.createServer(app);
const request = require("supertest");
const { client } = require("../shared/redis-client.js");
const { ACCESS_TOKEN_SECRET } = require("../shared/constants.js");
const { truncTables, insertRows } = require("./config/setup-jest.js");
const { fetchProductData } = require("../fetch/fetch-products.js");
const { subscriberInit, subscriber } = require("../shared/subscriber-init.js");
const {
  insertData,
  ippalData,
  juuranData,
  abiplosData,
  insertRes,
  deleteData,
  deleteRes,
} = require("./data/crud-data.js");
const {
  beaniesRes,
  facemasksRes,
  glovesRes,
  beaniesRedisRes,
  facemasksRedisRes,
  glovesRedisRes,
} = require("./data/product-data.js");

server.listen(3020);

const reset = async () => {
  await truncTables();
  await new Promise((resolve) => setTimeout(() => resolve(), 500));
  await insertRows();
};

beforeAll(async () => {
  await client.flushall();
  await subscriberInit();
  await reset();
});

afterAll(async () => {
  await new Promise((resolve) => setTimeout(() => resolve(), 500));
  await client.quit();
  await subscriber.quit();
  await server.close();
  await new Promise((resolve) => setTimeout(() => resolve(), 500));
});

describe("GET product data should fail", () => {
  test("Request with no token", async () => {
    await request(app)
      .get("/")
      .set({
        "X-VERSION": "v2",
        "X-PRODUCT": "beanies",
      })
      .expect(401)
      .expect("Proper authorization credentials were not provided.");
  });
  test("Request with the wrong token", async () => {
    await request(app)
      .get("/")
      .set({
        "X-WEB-TOKEN": "Squirrel1",
        "X-VERSION": "v2",
        "X-PRODUCT": "beanies",
      })
      .expect(403)
      .expect("Invalid authentication credentials.");
  });
  test("Right credentials, nonexistent product", async () => {
    await request(app)
      .get("/")
      .set({
        "X-WEB-TOKEN": ACCESS_TOKEN_SECRET,
        "X-VERSION": "v2",
        "X-PRODUCT": "tophats",
      })
      .expect(404)
      .expect("The requested product tophats does not exist.");
  });
});

describe("GET product data should succeed", () => {
  test("Request beanies product data succeeds", async () => {
    await request(app)
      .get("/")
      .set({
        "X-WEB-TOKEN": ACCESS_TOKEN_SECRET,
        "X-VERSION": "v2",
        "X-PRODUCT": "beanies",
      })
      .expect("Content-Type", /json/)
      .expect(200)
      .expect(beaniesRes);
  });

  test("Requesting beanies again gives a res from Redis", async () => {
    await request(app)
      .get("/")
      .set({
        "X-WEB-TOKEN": ACCESS_TOKEN_SECRET,
        "X-VERSION": "v2",
        "X-PRODUCT": "beanies",
      })
      .expect("Content-Type", /json/)
      .expect(200)
      .expect(beaniesRedisRes);
  });

  test("Request facemasks product data succeeds", async () => {
    await request(app)
      .get("/")
      .set({
        "X-WEB-TOKEN": ACCESS_TOKEN_SECRET,
        "X-VERSION": "v2",
        "X-PRODUCT": "facemasks",
      })
      .expect("Content-Type", /json/)
      .expect(200)
      .expect(facemasksRes);
  });

  test("Requesting facemasks again gives a res from Redis", async () => {
    await request(app)
      .get("/")
      .set({
        "X-WEB-TOKEN": ACCESS_TOKEN_SECRET,
        "X-VERSION": "v2",
        "X-PRODUCT": "facemasks",
      })
      .expect("Content-Type", /json/)
      .expect(200)
      .expect(facemasksRedisRes);
  });

  test("Request gloves product data succeeds", async () => {
    await request(app)
      .get("/")
      .set({
        "X-WEB-TOKEN": ACCESS_TOKEN_SECRET,
        "X-VERSION": "v2",
        "X-PRODUCT": "gloves",
      })
      .expect("Content-Type", /json/)
      .expect(200)
      .expect(glovesRes);
  });

  test("Requesting gloves again gives a res from Redis", async () => {
    await request(app)
      .get("/")
      .set({
        "X-WEB-TOKEN": ACCESS_TOKEN_SECRET,
        "X-VERSION": "v2",
        "X-PRODUCT": "gloves",
      })
      .expect("Content-Type", /json/)
      .expect(200)
      .expect(glovesRedisRes);
  });
});

describe("DB actions should succeed", () => {
  test("INSERT data, UPDATE Availability", async () => {
    // Product data by default has no availability set, so an update is required as part of this test
    fetchMock.mockResponses(
      [JSON.stringify(insertData)],
      [JSON.stringify(ippalData)],
      [JSON.stringify(juuranData)],
      [JSON.stringify(abiplosData)]
    );
    // Flush Redis
    client.flushall();
    // Insert a new value into DB
    await fetchProductData("beanies");
    // Give time for Insert/Update
    await new Promise((resolve) => setTimeout(() => resolve(), 100));
    // Test response
    await request(app)
      .get("/")
      .set({
        "X-WEB-TOKEN": ACCESS_TOKEN_SECRET,
        "X-VERSION": "v2",
        "X-PRODUCT": "beanies",
      })
      .expect("Content-Type", /json/)
      .expect(200)
      .expect(insertRes);
  });

  test("DELETE data", async () => {
    await reset();
    fetchMock.mockResponses(
      [JSON.stringify(deleteData)],
      [JSON.stringify(ippalData)]
    );
    // Flush Redis
    client.flushall();
    // Insert a new value into DB
    await fetchProductData("beanies");
    // Give time for Insert/Update
    await new Promise((resolve) => setTimeout(() => resolve(), 100));
    // Test response
    await request(app)
      .get("/")
      .set({
        "X-WEB-TOKEN": ACCESS_TOKEN_SECRET,
        "X-VERSION": "v2",
        "X-PRODUCT": "beanies",
      })
      .expect("Content-Type", /json/)
      .expect(200)
      .expect(deleteRes);
  });
});
