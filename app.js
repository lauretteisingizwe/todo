const express = require("express");
const cors = require("cors");


const app = express();
app.use(express.json());

app.use(cors());
const bodyParser = require("body-parser");
app.use(bodyParser.json());


const db = require("./models");

app.use("/api/todos", require("./routes/todos-router"));
app.use("/api/user", require("./routes/user-router"));
app.all("*", (req, res) => {
  res.status(404).send({ message: "Route not found" });
})

db.sequelize
  .sync({  })
  .then(() => {
    app.listen(5000, () => {
      console.log("App is runnig on port http://localhost:5000");
    });
  })
  .catch((error) => {
    console.log(error);
  });
