const http = require("http");
const { app } = require("../index.js");
const server = http.createServer(app);
const request = require("supertest");
const { client } = require("../shared/redis-client.js");
const { beaniesRes, facemasksRes, glovesRes } = require("./test-data.js");
const { ACCESS_TOKEN_SECRET } = require("../shared/constants.js");

server.listen(3020);

afterAll(async () => {
  await client.quit();
  await server.close();
  await new Promise((resolve) => setTimeout(() => resolve(), 500)); // Avoid jest open handle error
});

describe("GET product data should fail", () => {
  test("Request with no token", async (done) => {
    await request(app)
      .get("/")
      .set({
        "X-VERSION": "v2",
        "X-PRODUCT": "beanies",
      })
      .expect(401)
      .expect("Proper authorization credentials were not provided.");
    done();
  });
  test("Request with the wrong token", async (done) => {
    await request(app)
      .get("/")
      .set({
        "X-WEB-TOKEN": "Squirrel1",
        "X-VERSION": "v2",
        "X-PRODUCT": "beanies",
      })
      .expect(403)
      .expect("Invalid authentication credentials.");
    done();
  });
  test("Right credentials, nonexistent product", async (done) => {
    await request(app)
      .get("/")
      .set({
        "X-WEB-TOKEN": ACCESS_TOKEN_SECRET,
        "X-VERSION": "v2",
        "X-PRODUCT": "tophats",
      })
      .expect(404)
      .expect("The requested product tophats does not exist.");
    done();
  });
});

describe("GET product data should succeed", () => {
  test("Request beanies product data succeeds", async (done) => {
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
    done();
  });

  test("Request facemasks product data succeeds", async (done) => {
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
    done();
  });

  test("Request gloves product data succeeds", async (done) => {
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
    done();
  });
});
