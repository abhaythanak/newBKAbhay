const express = require("express");
const app = express()
const PORT = 3001 

app.get("/user",(req,res)=>{
    res.send({name:"abhay",age:21,gender:"male"})
})
// this will match all http method like get,post,put,delete,patch,options,head,trace
app.use("/test",(req,res)=>{
    res.send("Hello ADA")
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})