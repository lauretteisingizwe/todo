const express = require("express");
const { required } = require("joi");
const router = express.Router();
const joi = require("joi");
const bcrypt = require("bcryptjs");
const uuid = require("uuid");

const db = require("../models");
const user = require("../models/users");

//get all users
router.get("/", async (req, res) => {
  try {
    const data = await db.User.findAll();
    res.status(200).send({ data });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});
  //get by id
  router.get("/:id", async (req, res) => {
    const id = req.params.id;
    try {
      const data = await db.User.findByPk(id);
      if (data) {
        return res.json(data);
      }
      return res.status(404).send({ message: "this user doesn't exist" });
    } catch (error) {
      res.status(500).send(error);
    }
  });
  // delete user
  router.delete("/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const users = await db.User.destroy({ where: { id } });

      if (users) {
        return res.status(200).send({ message: "user deleted" });
      }
      return res.status(404).send({ message: "user doesn't exist" });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  });
    // Login
    router.post("/login", async (req, res) => {
      try {
        const { email, password } = req.body;

        if (!email || !password) {
          return res.status(400).send({ message: "Email or password required" });
        }
        // if (!password) {
        //   return res.status(400).send({ message: "password is required" });
        // }

        const user = await db.User.findOne({ where: { email } });

        if (!user) {
          return res.status(404).send({ message: "invalid email or password" });
        }
        return res.status(200).send({ message: "successfully logged in" });

        // bcrypt.compare(password, user.password).then((match) => {
        //   if (!match) {
        //     return res.status(406).send({ error: "Wrong username or password" });
        //   }
        // });
      } catch (error) {
        console.log(error);
        res.status(500).send(error);
      }
    });

     // update

  router.put(
    "/:id",
    async (req, res) => {
      try {
        const id = req.params.id;
        const { name, email, password } = req.body;
        const schema = joi.object({
          name: joi.string().min(3).max(30).required(),
        });

        const { error, value } = schema.validate({ name: name });

        if (error)
          return res
            .status(400)
            .send({ message: "Please fill in the name", error });

        const data = await db.User.findByPk(id);
        if (!data)
          return res.status(404).send({ message: "user doesn't exist" });
        data.name = name;
        data.email = email;
        data.password = password;
        await data.save();
        const user = await data.save();

        if (data) {
          return res.status(200).send({ message: "user updated", data: user });
        }
      } catch (error) {
        console.log(error);

        res.status(500).send(error);
      }
    },  
  );
// user registration
router.post(
  "/",
  async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const schema = joi.object({
        name: joi.string().min(3).max(30).required(),
      });

      const { error, value } = schema.validate({ name: name });

      if (error)
        return res
          .status(400)
          .send({ message: "Please fill in the name", error });

      console.log(req.body);

      const User = await db.User.create({
        name: name,
        email: email,
        password: bcrypt.hashSync(password),
      });
      return res
        .status(200)
        .send({ message: "user registered", data: User });
       

     
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
      console.log(error);
    }
  },
);
module.exports = router;
