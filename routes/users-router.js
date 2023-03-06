const express = require("express");
const { required } = require("joi");
const router = express.Router();
const joi = require("joi");
const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../Authmiddleware");
const db = require("../models");
const users = require("../models/User");
const { sequelize } = require("../models");
const { Op } = require("sequelize");
const { validatelogin} = require("../validator");
const User = require("../models/User");



//get all users
router.get("/", async (req, res) => {
  try {
    let where = {};
    if (req.query.name) {
      where = {
        ...where,
        name: {
          [Op.substring]: req.query.name,
        },
      };
    }
    if (req.query.createdAt) {
      where = {
        ...where,
        createdAt: req.query.createdAt,
      };
    }
    console.log(req.query.createdAt);
    const data = await db.User.findAll({
      where,
      attributes: { exclude: ["password"] },
    });

    res.status(200).send({ data });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});
// get by id

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await db.User.findByPk(id, {
      where: { id: id },
      attributes: { exclude: ["password"] },
    });
    if (data) {
      return res.status(200).send({ data });
    }
    return res.status(404).send({ message: "this user doesn't exist" });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// delete user
router.delete("/:id", validateToken, async (req, res) => {
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
  
    const { error, value } = validatelogin(req.body);
    if (error) 
    return res.status(404).send({ message: "invalid request", error });

    const { email, password } = req.body;

    const user = await db.User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).send({ message: "invalid email" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(404).send({ message: "incorrect password" });
    }
    const accessToken = sign(
      {
        email: user.email,
        id: user.id,
        name: user.name,
      },
      process.env.SECRET_TOKEN,
      // {
      //   expireIn: 5*60*60
      // }
    );
    res.status(200).json({
      message: "successfully logged in!",
      token: accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// update

router.put("/:id", validateToken, async (req, res) => {
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
    if (!data) return res.status(404).send({ message: "user doesn't exist" });
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
});
// user registration
router.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const schema = joi.object({
      name: joi.string().min(3).max(30).required(),
      password: joi.string().min(8).required(),
    });

    const { error, value } = schema.validate({
      name: "name",
      password: "password",
    });

    if (error)
      return res
        .status(400)
        .send({ message: "Please fill in the name", error });

    //   const email = await db.User.findOne({ where: { email } });

    // if (email) {
    //   return res.status(404).send({ message: "email already exist" });
    // }
    console.log(req.body);

    const User = await db.User.create({
      name: name,
      email: email,
      password: bcrypt.hashSync(password),
    });

    return res.status(200).send({ message: "user registered", data: User });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
    console.log(error);
  }
});

module.exports = router;
// get by name and date

// router.get("/:name", async (req, res) => {
// console.log(req.params.name)
// const name = req.params.name;
// const createdAt = req.params.createdAt;
//   try {
//     const user = await db.User.findOne({where: {name: name, createdAt}
//     });
//     if (!user) {
//       return res.status(404).send({
//         message: 'User not found'
//       });
//     }
//     return res.send(user);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).send('Server error');
//   }
// });
