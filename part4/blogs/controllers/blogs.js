const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
    __id: 1,
  });
  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  response.json(blog);
});

blogsRouter.post("/", async (request, response) => {
  console.log("decodedToken:", request.decodedToken);
  if (!request.token || !request.decodedToken) {
    return response.status(401).json({ error: "token missing or invalid" });
  }
  const user = await User.findById(request.decodedToken.id);
  console.log(user);
  const blog = new Blog({ ...request.body, user: user.id });

  if (typeof blog.likes === "undefined" || blog.likes === null) {
    blog.likes = 0;
  }

  if (
    typeof blog.title === "undefined" ||
    blog.title === null ||
    typeof blog.url === "undefined" ||
    blog.url === null
  ) {
    response.status(400).end();
  } else {
    const result = await blog.save();
    user.blogs = user.blogs.concat(result._id);
    await user.save();
    response.status(201).json(result.toJSON());
  }
});

blogsRouter.delete("/delete/:id", async (request, response) => {
  const data = await Blog.findByIdAndDelete(request.params.id);
  console.log(data);
  if (data) {
    return response.status(204).end();
  }
  response
    .status(400)
    .json({ error: `Blog with id:${request.params.id} not found` });
});

blogsRouter.put("/update/:id", async (request, response) => {
  console.log(request.body);
  const { title, author, url, likes } = request.body;
  if (!title || !url) {
    return response.status(400).json({ error: "Title and URL are required" });
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { title, author, url, likes },
    { new: true }
  );

  if (updatedBlog) {
    return response.json(updatedBlog);
  }

  response
    .status(404)
    .json({ error: `Blog with id:${request.params.id} not found` });
});

module.exports = blogsRouter;
