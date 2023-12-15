const User = require("../models/user");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const totalLikes = blogs.reduce(function (accumulator, currentBlog) {
    return accumulator + currentBlog.likes;
  }, 0);

  return totalLikes;
};

const favoriteBlog = (blogs) => {
  const blogWithMostLikes = blogs.reduce(function (maxBlog, currentBlog) {
    if (currentBlog.likes > maxBlog.likes) {
      return currentBlog;
    }
    return maxBlog;
  }, blogs[0]);
  return blogWithMostLikes;
};

const mostBlogs = (blogs) => {
  const authorBlogCount = {};

  blogs.forEach((blog) => {
    if (authorBlogCount[blog.author]) {
      authorBlogCount[blog.author]++;
    } else {
      authorBlogCount[blog.author] = 1;
    }
  });

  const mostProlificAuthor = Object.keys(authorBlogCount).reduce(
    (maxAuthor, currentAuthor) => {
      return authorBlogCount[currentAuthor] > authorBlogCount[maxAuthor]
        ? currentAuthor
        : maxAuthor;
    },
    Object.keys(authorBlogCount)[0]
  );

  return {
    author: mostProlificAuthor,
    blogs: authorBlogCount[mostProlificAuthor],
  };
};

const mostLikes = (blogs) => {
  const authorLikeCount = {};

  blogs.forEach((blog) => {
    if (authorLikeCount[blog.author]) {
      authorLikeCount[blog.author] += blog.likes;
    } else {
      authorLikeCount[blog.author] = blog.likes;
    }
  });

  const mostProlificAuthor = Object.keys(authorLikeCount).reduce(
    (maxAuthor, currentAuthor) => {
      return authorLikeCount[currentAuthor] > authorLikeCount[maxAuthor]
        ? currentAuthor
        : maxAuthor;
    },
    Object.keys(authorLikeCount)[0]
  );

  return {
    author: mostProlificAuthor,
    likes: authorLikeCount[mostProlificAuthor],
  };
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
  usersInDb,
};
