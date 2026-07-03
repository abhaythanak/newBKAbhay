const PORT = process.env.PORT || 5555;
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://abhaythanak_db_user:UyayE5twYTKgaALa@cluster0.qw9e9gn.mongodb.net/devTinder";
const JWT_SECRET = process.env.JWT_SECRET || "Abhay@123";

module.exports = {
    PORT,
    MONGO_URI,
    JWT_SECRET
};
