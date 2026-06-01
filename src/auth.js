const userAuth = (req,res,next)=>{
    const token = 'xyz';
    const isAuthenticated = token === 'xyz'
    if(!isAuthenticated) {
        return res.status(401).send("unauthorized user")
    }
    next();
}
module.exports = {userAuth};
