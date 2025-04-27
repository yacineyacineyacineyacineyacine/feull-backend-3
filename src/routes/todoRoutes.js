import express from "express";
import db from "../db.js";
import prisma from "../prismaClient.js";

const router = express.Router();

router.get("/", async (req, res) =>{
    
    const todos = await prisma.todo.findMany({
      where:{
         userId: req.userId
      }
    })
   
    res.status(200).json(todos)


});

router.post("/", async (req, res) =>{
   const {task} = req.body;

   const todo = await prisma.todo.create({
      data:{
         task,
         userId: req.userId
      }
   })

   res.status(201).json(todo);
});

router.put("/:id", async (req, res) =>{

    const { completed } = req.body
    const { id } = req.params;
    const userId = req.userId;
    
   const updatedTodo = await prisma.todo.update({
      where:{
         id: parseInt(id),
         userId
      },
      data:{
         completed: !!completed
      }
   })

   res.status(201).json(updatedTodo)
})

router.delete("/:id", async (req, res) => {
   const { id } = req.params;
   const userId = req.userId;

   const deletedTodo = await prisma.todo.delete({
      where:{
         id: parent(id),
         userId
      }
   })

   res.status(201).json(deletedTodo);
})


export default router;