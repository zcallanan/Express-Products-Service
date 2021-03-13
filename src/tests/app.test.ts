import { enableFetchMocks } from "jest-fetch-mock";

enableFetchMocks(); // eslint complains, but must come before other imports
// eslint-disable-next-line import/first
import http from "http";
// eslint-disable-next-line import/first
import request from "supertest";
// eslint-disable-next-line import/first
import { RedisClient } from "redis";
// eslint-disable-next-line import/first
import { app } from "../index";
// eslint-disable-next-line import/first
import { getClient } from "../shared/redis-client";
// eslint-disable-next-line import/first
import { ACCESS_TOKEN_SECRET } from "../shared/constants";
// eslint-disable-next-line import/first
import { truncTables, insertRows } from "./config/setup-jest";
// eslint-disable-next-line import/first
import fetchProductData from "../fetch/fetch-products";
// eslint-disable-next-line import/first
import subscriberInit from "../shared/subscriber-init";
// eslint-disable-next-line import/first
import {
  insertData,
  ippalData,
  juuranData,
  abiplosData,
  insertRes,
} from "./data/insert-data";
// eslint-disable-next-line import/first
import { deleteData, deleteRes } from "./data/delete-data";
// eslint-disable-next-line import/first
import {
  beaniesRes,
  facemasksRes,
  glovesRes,
  beaniesRedisRes,
  facemasksRedisRes,
  glovesRedisRes,
} from "./data/product-data";
// eslint-disable-next-line import/first
import {
  updateData,
  updateRes,
  hennexData,
  abiFData,
} from "./data/update-data";

const server = http.createServer(app);
server.listen(3020);

let subscriber: RedisClient;
let client: RedisClient;

const reset = async (): Promise<void> => {
  await truncTables();
  await new Promise<string>((resolve) => setTimeout(() => resolve("Done"), 500));
  await insertRows();
  await client.flushall();
};

beforeAll(async (): Promise<void> => {
  subscriber = await subscriberInit();
  client = await getClient();
  await reset();
});

afterAll(async (): Promise<void> => {
  await new Promise<string>((resolve) => setTimeout(() => resolve("Done"), 500));
  await client.quit();
  await subscriber.quit();
  await server.close();
  await new Promise<string>((resolve) => setTimeout(() => resolve("Done"), 500));
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
  test("INSERT data, UPDATE product availability", async () => {
    // Product data by default has no availability set, so an update is required
    fetchMock.mockResponses(
      [JSON.stringify(insertData), { status: 200 }],
      [JSON.stringify(ippalData), { status: 200 }],
      [JSON.stringify(juuranData), { status: 200 }],
      [JSON.stringify(abiplosData), { status: 200 }],
    );
    // Flush Redis
    client.flushall();
    // Insert a new value into DB
    await fetchProductData("beanies");
    // Give time for Insert/Update
    await new Promise<string>((resolve) => setTimeout(() => resolve("Done"), 200));
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
    await new Promise<string>((resolve) => setTimeout(() => resolve("Done"), 100));
    fetchMock.mockResponses(
      [JSON.stringify(deleteData), { status: 200 }],
      [JSON.stringify(ippalData), { status: 200 }],
    );
    // Insert a new value into DB
    await fetchProductData("beanies");
    // Give time for Delete
    await new Promise<string>((resolve) => setTimeout(() => resolve("Done"), 100));
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

  test("UPDATE product name, manufacturer, price, colors", async () => {
    await reset();
    await new Promise<string>((resolve) => setTimeout(() => resolve("Done"), 100));
    fetchMock.mockResponses(
      [JSON.stringify(updateData), { status: 200 }],
      [JSON.stringify(hennexData), { status: 200 }],
      [JSON.stringify(abiFData), { status: 200 }],
    );
    // Update values
    await fetchProductData("facemasks");
    // Give time for Update
    await new Promise<string>((resolve) => setTimeout(() => resolve("Done"), 100));
    // Test response
    await request(app)
      .get("/")
      .set({
        "X-WEB-TOKEN": ACCESS_TOKEN_SECRET,
        "X-VERSION": "v2",
        "X-PRODUCT": "facemasks",
      })
      .expect("Content-Type", /json/)
      .expect(200)
      .expect(updateRes);
  });
});
