const mongoose = require("mongoose");

function connectDB() {

    mongoose.connect(process.env.MONGO_DB_URL).then((conn, err) => {
        if(err){
            console.log("Error: "+err);
        }else{
            console.log("Connected");
        }
    })
}

module.exports = connectDB;