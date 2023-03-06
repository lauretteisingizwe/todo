const { verify } = require("jsonwebtoken");
require("dotenv").config();

function validateToken(req, res, next) {
  const accessToken = req.header("Authorization");

  if (!accessToken)
    return res.status(404).send({ error: "User is not logged in" });
  try {
    const validToken = verify(accessToken, process.env.SECRET_TOKEN);
    req.userId = validToken.id;
    if (validToken) {
      return next();
    }
  } catch (err) {
    return res.status(500).send({ error: err });
  }
}



module.exports = { validateToken };