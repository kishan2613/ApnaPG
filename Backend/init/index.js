const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing  = require("../models/listing.js");

const Mongo_URL = "mongodb://127.0.0.1:27017/ApnaPG";

main().then(()=>{
    console.log("Conncection Established in index.js");
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(Mongo_URL);
}

const initDB = async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj, owner:"6868f154a148e7e5e28b269c"}));
    await Listing.insertMany(initData.data);
    console.log("Data was saved");
};

initDB();