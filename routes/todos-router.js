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

//create a task

router.post("/", async (req, res) => {
  try {

    if (!req.body.name) {
      return res.status(400).send({ message: "name is a required" });
    }
    const todo = req.body;
    todo.id = uuid.v4();
    const isTodoSaved = await todos.create(todo);
    if (isTodoSaved) {
      res.status(200).send({ message: "Todo saved", data: todo });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

// get by id
router.get("/todos/:uuid", async (req, res) => {
  const uuid = req.params.uuid;
  try {
    const todo = await todo.findOne();
    where: {
      uuid;
    }
    return res.json(todo);
  } catch (error) {
    console.log(err);
    return res.status(500).json({ error: "something went wrong" });
  }
});

//update

router.put("/todos/:uuid", async (req, res) => {
  try {
    if (!req.body.uuid) {
      return res.status(400).send({ message: "ID is required" });
    }
    const { uuid, name } = req.body;
    await todos.update({ uuid, name }, { where: { uuid } });
    res.status(200).send({ message: "task updated", data: { uuid, name } });
  } catch (error) {
    res.status(500).send(error);
  }
});

// delete task
router.delete("/todos/:uuid", async (req, res) => {
  try {
    const uuid = req.params.uuid;
    await todos.destroy({ where: { uuid } });
    res.status(200).send({ message: "task deleted" });
  } catch (error) {
    res.status(500).send(error);
  }
});
module.exports = router;
