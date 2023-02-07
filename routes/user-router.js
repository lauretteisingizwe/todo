const express = require("express");
const { required } = require("joi");
const router = express.Router();
const joi = require("joi");
const bcrypt = require("bcryptjs");
const uuid = require("uuid");

const db = require("../models");
const user = require("../models/user");

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

// user registration
router.post(  "/register",  async (req, res) => {
  try {
        const {name,email,password }= req.body;       
         const schema = joi.object({
          name: joi.string()
            .min(3)
            .max(30)
            .required(),
          
          
      })

      const { error, value } = schema.validate({ name: name});

      if (error)
      return res.status(400).send({ message: "Please fill in the name" , error});
      
    console.log(req.body);

    const addUser = await db.User.create({name: name, email: email,  password: bcrypt.hashSync(user.password)}); 
    return res.status(200).send({message:"user registered", data: addUser}); 

      const user = await db.User.findOne({ where: { email } });
        if (!user) {
        return res.status(404).send({ message: "email already exist" });
    
           }
    
     
    
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
    console.log(error);
  }
},

  //get by id
  router.get("/:userid", async (req, res) => {
    const userid = req.params.userid;
    try {
      const data = await db.User.findByPk(userid);
      if (data) {
        return res.json(data);
      }
      return res.status(200).send({ message: "this user doesn't exist" });
   
    } catch (error) {
      res.status(500).send(error);
    }
  }),

    // delete user
    router.delete("/:userid", async (req, res) => {
      try {
        const userid = req.params.userid;
        const users = await db.User.destroy({ where: { userid } });

        if (users) {
          return res.status(200).send({ message: "user deleted" });
        }  
        return res.status(200).send({ message: "user doesn't exist" });
      } catch (error) {
        console.log(error)
        res.status(500).send(error);
      }
    }),

     // update

     router.put("/:userid",async (req, res) => {
      try {
        const userid = req.params.userid;
        const { name,email, password } = req.body;
          const schema = joi.object({
            name: joi.string()
              .min(3)
              .max(30)
              .required(),
        })

        const { error, value } = schema.validate({ name: name });

        if (error)
        return res.status(400).send({ message: "Please fill in the name" , error});

        const data = await db.User.findByPk(userid);
        if(!data)
        return res.status(404).send({message: "user doesn't exist"});
        data.name = name;
        data.email = email;
        data.password = password;
        await data.save();
        const user = await data.save();

        if (data) {
          return res
            .status(200)
            .send({ message: "user updated", data: user});
        
        }
      } catch (error) {
        console.log(error);

        res.status(500).send(error);
      }
    },

// Login
router. post ("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

     if (!req.body.email) {
      return res.status(400).send({ message: "Email is required" });
    }
    if (!req.body.password) {
      return res.status(400).send({ message: "password is required" });
    }

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
   
  }catch (error) {
    console.log(error)
    res.status(500).send(error);
  }
}))
, 
  module.exports = router,
)
 