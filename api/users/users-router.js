const express = require("express");

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();
const Users = require("./users-model");
const Posts = require("../posts/posts-model");
const { validateUser, validateUserId, validatePost } = require("../middleware/middleware");

router.get("/", (req, res) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  Users.get()
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      res.status(500).json({ message: "Error retrieving users" });
    });
});

router.get("/:id", validateUserId, (req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  const { id } = req.params;

  Users.getById(id)
    .then((user) => {
      if (user) {
        req.user = user;

        res.json(req.user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Eror retrieving user" });
    });
});
//

router.post("/", validateUser, (req, res) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  Users.insert(req.body)
    .then((newUser) => {
      res.status(201).json(newUser);
    })
    .catch((err) => {
      res.status(500).json({ message: "Error creating user" });
    });
});

router.put("/:id", validateUserId, validateUser, (req, res) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  const { id } = req.params;
  Users.update(id, req.body)
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => res.status(500).json({ message: "Error updating user" }));
});

router.delete("/:id", validateUserId, (req, res) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  const { id } = req.params;
  Users.remove(id)
    .then((deletedUser) => {
      if (deletedUser) {
        res.json(req.user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Error deleting user" });
    });
});

router.get("/:id/posts", validateUserId, (req, res) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  const { id } = req.params;
  Users.getUserPosts(id)
    .then((posts) => {
      res.json(posts);
    })
    .catch((err) => {
      res.status(500).json({ message: "Error retriving user posts" });
    });
});

router.post("/:id/posts", validateUserId, validatePost, (req, res) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  const { id } = req.params;
  const postData = { ...req.body, user_id: id };
  Posts.insert(postData)
    .then((newPost) => {
      res.status(201).json(newPost);
    })
    .catch((err) => {
      res.status(500).json({ message: "Error creating post" });
    });
});

// do not forget to export the router
module.exports = router;
