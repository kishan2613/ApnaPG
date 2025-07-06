const Listing = require("../models/listing");
module.exports.index = async(req,res)=>{
    const alllisting = await Listing.find({});
    res.render("listings/index.ejs",{alllisting});
};