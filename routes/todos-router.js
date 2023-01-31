const express = require("express");
const { update } = require("tar");
const router = express.Router();
const uuid = require("uuid");

// get all tasks

router.get("/todos", async (req, res) => {
  try {
    const todos = await todos.findAll();
    res.status(200).send({ data: allTodos });
  } catch (error) {
    res.status(500).send(error);
  }
});

// create a task

router.post("/", async (req, res) => {
  try {

    if (!req.body.name) {
      return res.status(400).send({ message: "name is a required" });
    }
    const todo = req.body;
    todo.id = uuid.v4();
    const isTodoSaved = await todos.create(todo);
    if (isTodoSaved) {
      res.status(200).send({ message: "Task saved", data: todo });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

// get by id
router.get("/todos/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const todo = await todo.findOne();
    where: {
      id;
    }
    return res.json(todo);
  } catch (error) {
    res.status(500).send(error);
  }
});

// update

router.put("/todos/:id", async (req, res) => {
  try {
    if (!req.body.id) {
      return res.status(400).send({ message: "ID is required" });
    }
    const { id, name } = req.body;
    await todos.update({ id, name }, { where: {id } });
    res.status(200).send({ message: "task updated", data: { id, name } });
  } catch (error) {
    res.status(500).send(error);
  }
});

// delete task
router.delete("/todos/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await todos.destroy({ where: { id } });
    res.status(200).send({ message: "task deleted" });
  } catch (error) {
    res.status(500).send(error);
  }
});
module.exports = router;
