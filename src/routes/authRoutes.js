import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";
import { log } from "console";

const router = express.Router();

router.post("/register", (req, res)=> {
    const { username, password } = req.body;
    
    const salt = bcrypt.genSaltSync(8);
    const hashedPassword = bcrypt.hashSync(password, salt);

    try {
        
       const insertUser =  db.prepare(`INSERT INTO users (username, password) VALUES (?, ?)`);
       const result = insertUser.run(username, hashedPassword);     
              
       const defaultTodo = `Hello :) Add you first todo!`;
       const inserTodo = db.prepare(`INSERT INTO todos (user_id, task) VALUES (?, ?)`);
       inserTodo.run(result.lastInsertRowid, defaultTodo);

       const token = jwt.sign({id: result.lastInsertRowid}, process.env.JWT_SECRET, {expiresIn: "24h"});
              
        res.status(201).json({token})
    } catch (error) {
        console.log(error);
        
        res.sendStatus(503)
    }
    
    
   
    

});

router.post("/login", (req, res)=> {
    
    const { username, password } = req.body;
   
    try {
        const getUser = db.prepare(`SELECT * FROM users WHERE username = ?`);
        const user = getUser.get(username);
    
        if(!user) return res.status(404).json({message: "User not found"})
    
        const isValidPassword = bcrypt.compareSync(password, user.password);
        
        if(!isValidPassword) return res.status(401).json({message: "Invalid password"});

        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: "24h"});

        res.status(200).json({token});

    } catch (error) {
        console.log(error.message);
        res.sendStatus(503);
        
    }

    
});

export default router;