const usersRouter = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    title: 1,
    author: 1,
    url: 1,
    likes: 1,
  });
  response.json(users);
});

usersRouter.post("/", async (request, response) => {
  if (request.body.password.length < 3) {
    response.status(400).json({ error: "Password not long enough" });
  } else {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(request.body.password, saltRounds);

    const user = new User({
      username: request.body.username,
      name: request.body.name,
      password: passwordHash,
    });

    try {
      const savedUser = await user.save();
      response.status(201).json(savedUser.toJSON());
    } catch (error) {
      response.status(400).json({ error: "expected `username` to be unique" });
    }
  }
});

module.exports = usersRouter;
