const express = require("express");
const { required } = require("joi");
const router = express.Router();
const joi = require("joi");

const db = require("../models");

// get all tasks

router.get("/", async (req, res) => {
  try {
    const data = await db.Todos.findAll();
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
    const data = await db.Todos.findByPk(id);
    if (data) {
      return res.json(data);
    }
    return res.status(200).send({ message: "this task doesn't exist" });
  } catch (error) {
    res.status(500).send(error);
  }
});

// delete task
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const todo = await db.Todos.destroy({ where: { id } });

    if (todo) {
      return res.status(200).send({ message: "task deleted" });
    }
    return res.status(200).send({ message: "task doesn't exist" });
  } catch (error) {
    res.status(500).send(error);
  }
});


// update
router.put(
  "/:id",
  async (req, res) => {
    try {
      const id = req.params.id;
      const { name } = req.body;

      const schema = joi.object({
        name: joi.string().min(3).max(30).required(),
      });

      const { error, value } = schema.validate({ name: name });

      if (error)
        return res
          .status(400)
          .send({ message: "Please fill in the name", error });

      const data = await db.Todos.findByPk(id);
      if (!data) return res.status(404).send({ message: "task doesn't exist" });
      data.name = name;
      await data.save();
      const todo = await data.save();

      if (data) {
        return res.status(200).send({ message: "task updated", data: todo });
      }
    } catch (error) {
      console.log(error);

      res.status(500).send(error);
    }
  }

);

// create a task
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    const schema = joi.object({
      name: joi.string().min(3).max(30).required(),
    });

    const { error, value } = schema.validate({ name: name });

    if (error)
      return res
        .status(400)
        .send({ message: "Please fill in the name", error });
    console.log(req.body);
    const addTodos = await db.Todos.create({ name: name });
    return res.status(200).send({ message: "task created", data: addTodos });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
    console.log(error);
  }
});

module.exports = router;
