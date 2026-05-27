const express = require("express");
const app = express()
const PORT = 3001 

app.use("/bat",(req,res)=>{
    res.send("Hello ADA")
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})