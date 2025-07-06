const express = require("express");
const router  = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js"); // <-- MISSING
const passport = require("passport");
const {isLoggedin, isOwner} =require("../middleware.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});


const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};

// New form
router.get("/new",isLoggedin, wrapAsync(async (req, res) => {
   
    res.render("listings/new");

}));

// Show listing
router.get("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({path:"reviews",populate:{
        path:"author",
    }}).populate("owner");
    if(!listing){
        req.flash("error","Listing not found");
        res.redirect("/");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
}));

// Create listing
router.post("/",upload.single("listing[image]"), validateListing, wrapAsync(async (req, res) => {
    let url=req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    await newListing.save();
    req.flash("Success","New Listing created");
    res.redirect("/");
}));

// Update listing
router.put("/:id",isLoggedin,isOwner,upload.single("listing[image]"), validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file!=="undefined"){
    let url=req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
    }
    req.flash("Success","Listing Updated");
    res.redirect(`/listing/${id}`);
}));

//Edit Route
router.get("/:id/edit",isLoggedin,isOwner,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id); 
    res.render("listings/edit.ejs",{listing});
}));

// Delete listing
router.delete("/:id",isLoggedin,isOwner, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const deleted = await Listing.findByIdAndDelete(id);
    console.log(deleted);
    res.redirect("/");
}));

module.exports = router;
