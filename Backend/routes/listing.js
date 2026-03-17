const express = require("express");
const router  = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js"); // <-- MISSING
const passport = require("passport");
const {isLoggedin, isOwner} =require("../middleware.js");
const multer  = require('multer') //to use image handling
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
res.json({ listing });
    // res.render("listings/show.ejs", { listing });
}));

// Create listing
router.post(
  "/",
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(async (req, res) => {
    console.log("Body:", req.body);
    console.log("File:", req.file);
    console.log("User:", req.user);

    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();

    // Respond with JSON instead of redirect
    res.json({
      success: true,
      message: "New listing created",
      listing: newListing,
    });
  })
);


// Update listing
// router.put("/:id",isLoggedin,isOwner,upload.single("listing[image]"), validateListing, wrapAsync(async (req, res) => {
//     const { id } = req.params;
//     let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//     if(typeof req.file!=="undefined"){
//     let url=req.file.path;
//     let filename = req.file.filename;
//     listing.image = {url,filename};
//     await listing.save();
//     }
//     req.flash("Success","Listing Updated");
//     res.redirect(`/listing/${id}`);
// }));

router.put("/:id",upload.single("listing[image]"), validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file!=="undefined"){
    let url=req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
    }
    req.flash("Success","Listing Updated");
 res.json({ success: true, message: "Listing updated successfully", listing });}));

//Edit Route
// router.get("/:id/edit",isLoggedin,isOwner,wrapAsync(async(req,res)=>{
//     let {id} = req.params;
//     const listing = await Listing.findById(id); 
//     // res.render("listings/edit.ejs",{listing});
//     res.json({listing});
// }));

// Edit Route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    const { id } = req.params;
    // Populate the owner field
    const listing = await Listing.findById(id).populate("owner");
    if (!listing) {
        return res.status(404).json({ success: false, message: "Listing not found" });
    }
    res.json({ success: true, message: "Listing Updated", listing });
}));

// Delete listing
router.delete(
  "/:id",
  isLoggedin,
  isOwner,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const deleted = await Listing.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    res.json({
      success: true,
      message: "Listing deleted successfully",
      deletedListing: deleted,
    });
  })
);


module.exports = router;
