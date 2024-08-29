const assert = require("assert");
const { test, after, beforeEach } = require("node:test");
const Blog = require("../models/blog");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./test_helper");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

test("two blogs are returned as json", async () => {
  const response = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);

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

test("a valid blog can be added ", async () => {
  const newBlog = {
    title: "testTitle",
    author: "testAuthor",
    url: "url",
    likes: 10,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");

  const title = response.body.map((r) => r.title);

  assert.strictEqual(response.body.length, 3);

  assert(title.includes("testTitle"));
});

test("likes default to 0 if not provided", async () => {
  const newBlog = {
    title: "testTitleWithoutLikes",
    author: "testAuthorWithoutLikes",
    url: "urlWithoutLikes"
  };

  const response = await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  assert.strictEqual(response.body.likes, 0);

  const blogsAtEnd = await helper.blogsInDb();
  const addedBlog = blogsAtEnd.find(blog => blog.title === newBlog.title);

  assert.strictEqual(addedBlog.likes, 0);
});

test.only("blog without title or url returns 400 Bad Request", async () => {
  const newBlogWithoutTitle = {
    author: "testAuthor",
    url: "url",
    likes: 10,
  };

  const newBlogWithoutUrl = {
    title: "testTitle",
    author: "testAuthor",
    likes: 10,
  };

  await api
    .post("/api/blogs")
    .send(newBlogWithoutTitle)
    .expect(400)
    .expect("Content-Type", /application\/json/);

  await api
    .post("/api/blogs")
    .send(newBlogWithoutUrl)
    .expect(400)
    .expect("Content-Type", /application\/json/);
});

after(async () => {
  await mongoose.connection.close();
});
