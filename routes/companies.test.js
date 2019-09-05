// process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
const db = require("../db");

let testCo;

beforeEach(async function() {
  let result = await db.query(
    `INSERT INTO companies (code, name, description)
      VALUES ('test', 'testCo', 'testing')
      RETURNING code, name, description`
  );
  testCo = result.rows[0];
});

afterEach(async function() {
  await db.query("DELETE FROM companies");
});

afterAll(async function() {
  await db.end();
});

// TESTING GET ROUTES

describe("GET /companies", function() {
  test("Gets a list of 1 company", async function() {
    const response = await request(app).get("/companies");
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      companies: [testCo]
    });
  });
});

describe("GET /companies/:code", function() {
  test("Gets 1 company", async function() {
    testCo.invoices = [];
    const response = await request(app).get(`/companies/${testCo.code}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({'company': testCo});
  });
});

// TESTING POST ROUTES

describe("POST /companies", function() {
  test("Creates a new company", async function() {
    const response = await request(app)
      .post("/companies")
      .send({
        code: "test2",
        name: "testCo2",
        description: "testerino"
      });
    expect(response.statusCode).toEqual(201);
    expect(response.body).toEqual({
      company: {
        code: expect.any(String),
        name: "testCo2",
        description: "testerino"
      }
    });
  });
});

// TESTING PUT ROUTES

describe("PUT /companies/:code", function() {
  test("Creates a new company", async function() {
    const response = await request(app)
      .put(`/companies/${testCo.code}`)
      .send({
        code: "test2",
        name: "testCo2",
        description: "testerino"
      });
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      company: {
        code: expect.any(String),
        name: "testCo2",
        description: "testerino"
      }
    });
  });

  test("Responds with 404 if can't find company", async function() {
    const response = await request(app).put('/companies/firetruck');
    expect(response.statusCode).toEqual(404);
  });
});

// TESTING DELETE ROUTES

describe("DELETE /companies/:code", function() {
  test("Deletes a company", async function() {
    const response = await request(app).delete(`/companies/${testCo.code}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({message: "deleted"});
  });
});