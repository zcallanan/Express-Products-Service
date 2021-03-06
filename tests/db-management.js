const http = require("http");
const { app } = require("../index.js");
const server = http.createServer(app);
const request = require("supertest");
const { client } = require("../shared/redis-client.js");
const fetchProductData = require("../fetch/fetch-products.js");
const { truncTables, insertRows } = require("./config/db-setup.js");
const { beaniesInsert, ippalRes, juuranRes, abiplosRes } = require("./data/crud-data.js");

server.listen(3030);

fetchMock.mockResponses(
  [
    JSON.stringify([beaniesInsert]),
    { status: 200 }
  ],
  [
    JSON.stringify([ippalRes]),
  ],
  [
    JSON.stringify([juuranRes]),
  ],
  [
    JSON.stringify([abiplosRes]),
  ]
)

beforeAll(async () => {
  await truncTables();
  await insertRows();
});

afterAll(async () => {
  await client.quit();
  await server.close();
  await new Promise((resolve) => setTimeout(() => resolve(), 500)); // Avoid jest open handle error
});

describe("DB actions should succeed", () => {
  test("INSERT beanies data", async (done) => {
    // await new Promise((resolve) => setTimeout(() => resolve(), 10));
    await fetchProductData();
    done();
  });
});



/*
Seed fetch array
Call fetchProductData
*/

// describe("GET product data should fail", () => {
//   test("Request with no token", async (done) => {
//     await request(app)
//       .get("/")
//       .set({
//         "X-VERSION": "v2",
//         "X-PRODUCT": "beanies",
//       })
//       .expect(401)
//       .expect("Proper authorization credentials were not provided.");
//     done();
//   });
//   test("Request with the wrong token", async (done) => {
//     await request(app)
//       .get("/")
//       .set({
//         "X-WEB-TOKEN": "Squirrel1",
//         "X-VERSION": "v2",
//         "X-PRODUCT": "beanies",
//       })
//       .expect(403)
//       .expect("Invalid authentication credentials.");
//     done();
//   });
//   test("Right credentials, nonexistent product", async (done) => {
//     await request(app)
//       .get("/")
//       .set({
//         "X-WEB-TOKEN": ACCESS_TOKEN_SECRET,
//         "X-VERSION": "v2",
//         "X-PRODUCT": "tophats",
//       })
//       .expect(404)
//       .expect("The requested product tophats does not exist.");
//     done();
//   });
// });
