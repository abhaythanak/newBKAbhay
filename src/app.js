const express = require("express");
const app = express()
const PORT = 3001 

app.use("/",(req,res)=>{
    res.send("Hello ADA")
})
app.use("/abhay",(req,res)=>{
    res.send("abhay route")
})
app.use("/soumen",(req,res)=>{
    res.send("soumen route")
})
app.use("/rahul",(req,res)=>{
    res.send("rahul route")
})
app.use("/dipankar",(req,res)=>{
    res.send("dipankar route")
})
app.use("/biswajit",(req,res)=>{
    res.send("biswajit route")
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})