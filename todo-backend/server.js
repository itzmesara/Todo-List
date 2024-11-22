//Express
const express = require('express')
const mongoose = require('mongoose')
const cors=require('cors')
const dns=require('dns')

//instance of express
const app=express()
app.use(express.json())
app.use(cors())
//define route
// app.get('/',(req,res)=>{
//     res.send("Hello world")
// })


//Sample in-memory storage for todo items

// let todos=[];

//connect DB
const db=""

const network=(callback)=>{
    dns.resolve('www.google.com',(err)=>{
        if(err)
        {
            callback(false)
        }
        else{
            callback(true)
        }
    })
}

mongoose.connect(db).then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    network((isonline)=>{
        if(isonline)
        {
            console.error(err.message);
        }
        else
        {
            console.error("Internet Connection Error");
        }
    })
})


//create schema
const todoSchema=mongoose.Schema({
    title:
    {
        type:String,
        required:true
    },
    description:
    { 
        type:String,
        default:""
    }
})

//create model
const todoModel=mongoose.model('Todo',todoSchema);


//Create a new todo list
app.post("/todos",async (req,res)=>{
    const {title,description}=req.body;
    // const newTodo={
    //     id:todos.length + 1,
    //     title,
    //     description
    // };
    // todos.push(newTodo);
    // console.log(todos)

    try{
    const newTodo=new todoModel({title,description});
    await newTodo.save();
    res.status(201).json(newTodo);
    }
    catch(err)
    {
        console.log(err)
        res.status(500).json({message:err.message})
    }
})

//Get all items
app.get("/todos",async (req,res)=>{
    try {
       const todos = await todoModel.find();
       res.status(201).json(todos)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message})
    }
})

//update a todo item
app.put("/todos/:id",async (req,res)=>{
    try{
    const {title,description}=req.body;
    const id=req.params.id;

    const UpdatedTodo=await todoModel.findByIdAndUpdate(
        id,
        {title,description},{
            new:true
        }
    )

    if (!UpdatedTodo) {
        return res.status(404).json({message:"Todo not found"});
    }
    res.json(UpdatedTodo);
}catch(error)
{
    console.log(error);
    res.status(500).json({message:error.message})
}
})

//Delete

app.delete('/todos/:id',async (req,res)=>{
    try{
    const id=req.params.id;
    await todoModel.findByIdAndDelete(id);
    res.status(204).end();
    }catch(error)
    {
        console.log(error)
    }
})
//start the server
const port=8000;
app.listen(port,()=>{
    console.log(`Server is running ${port}`);
})