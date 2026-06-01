const express = require("express");
const app = express()
const PORT = 3001 
const {userAuth} = require('./auth')

app.get("/user",userAuth,(req,res)=>{
    res.send({name:"abhay",age:21,gender:"male"})
})
// this will match all http method like get,post,put,delete,patch,options,head,trace
app.use("/test",[(req,res,next)=>{
   // res.send("Hello ADA")
   console.log("hello")
   next();
},(req,res,next)=>{
    console.log("next1")
    next();
},(req,res,next)=>{
    console.log("next2")
    res.send("hello")
    next()
}])


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
}) 