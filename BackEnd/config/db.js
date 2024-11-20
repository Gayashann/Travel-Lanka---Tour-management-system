const mongoose = require ("mongoose");


const dburl = "mongodb+srv://dasith2024:dasith2002528@cluster0.plqlk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";



mongoose.set("strictQuery", true, "useNewUrlParser", true);


const connection = async ()=>{
    try{
        await mongoose.connect(dburl);
        console.log("mongoDB connected");
    }
    catch(e){
        console.error(e.message);
        process.exit();

    }
    
};

module.exports = connection