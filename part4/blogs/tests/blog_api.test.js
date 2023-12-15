const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const helper = require("../utils/list_helper");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const initialBlogs = [
  { title: "Blog 1", author: "Author 1", url: "url1", likes: 10 },
  { title: "Blog 2", author: "Author 2", url: "url2", likes: 12 },
];

beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObject = new Blog(initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(initialBlogs[1]);
  await blogObject.save();
});

describe("viewing a specific blog", () => {
  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");

    const responseWithoutId = response.body.map(({ id, ...rest }) => rest);
    const initialBlogsWithoutId = initialBlogs.map(({ id, ...rest }) => rest);

    expect(responseWithoutId).toEqual(initialBlogsWithoutId);
  });
  test("blogs have unique identifier named id", async () => {
    const response = await api.get("/api/blogs");

    const ids = response.body.map((blog) => blog.id);

    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});

describe("additional of a new blog", () => {
  test("length increase by one when creates a new blog post", async () => {
    const newBlog = new Blog({
      title: "Blog 5",
      author: "Author 3",
      url: "url5",
      likes: 3,
    });
    await newBlog.save();
    const response = await api.get("/api/blogs");
    expect(response.body.length).toBe(initialBlogs.length + 1);
  });

  test("likes default to value 0 when likes property is missing from the request", async () => {
    const newBlog = new Blog({
      title: "Blog 6",
      author: "Author 3",
      url: "url6",
    });
    await newBlog.save();
    expect(newBlog.likes).toBe(0);
  });

  test("if title & url properties are null, response status code 400 bad request", async () => {
    const newBlog = {
      body: {
        author: "Rangga Putra",
        likes: 7,
      },
    };
    const response = await api.post("/api/blogs", newBlog);
    expect(response.status).toBe(400);
  });
});

describe("deleteion of a blog", () => {
  test("succeeds with status code 204 if id is valid", async () => {});
});

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test("creation fails with proper statuscode and message if username already taken", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "salainen",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("expected `username` to be unique");

    const userAtEnd = await helper.usersInDb();
    expect(userAtEnd).toEqual(usersAtStart);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
