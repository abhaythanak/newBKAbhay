const express = require("express");
const app = express()
const PORT = 3001 
const {userAuth} = require('./auth')
app.use("/",(err,req,res)=>{
if (err){
    res.status(500).send("something went wrong")
}
})

app.get("/user",userAuth,(req,res)=>{
    res.send({name:"abhay",age:21,gender:"male"})
})
// this will match all http method like get,post,put,delete,patch,options,head,trace

app.use("/",(err,req,res)=>{
    if(err){
        res.status(500).send("something went wrong")
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
}) 