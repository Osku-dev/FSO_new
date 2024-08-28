const assert = require("assert");
const { test, after } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

test("two blogs are returned as json", async () => {
  const response = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);

  console.log(response.body);

  assert.deepStrictEqual(response.body.length, 2);
});

test("id is id and not _id", async () => {
  const response = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const allBlogsHaveId = response.body.every((blog) => blog.id && !blog._id);

  assert.deepStrictEqual(allBlogsHaveId, true);
});

test.only('a valid blog can be added ', async () => {
  const newBlog ={
    title: "testTitle",
    author: "testAuthor",
    url: "url",
    likes: 10,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const title = response.body.map(r => r.title)

  assert.strictEqual(response.body.length, 3)

  assert(title.includes("testTitle"))
})

after(async () => {
  await mongoose.connection.close();
});
