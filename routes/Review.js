const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js");
const { reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");  // Must be above
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");
const {isLoggedin, isReviewauthor} = require("../middleware.js");

// Middleware to validate review
const validatereview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.details.map(el => el.message).join(", "));
    } else {
        next();
    }
};

// CREATE review
router.post("/", isLoggedin,validatereview, wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    console.log(req.body);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    console.log(review);

    listing.reviews.push(review);       // Add review to listing
    await review.save();                // Save review first
    await listing.save();               // Then save listing

    console.log("New review saved:", review);
    res.redirect(`/listing/${listing._id}`);
}));

// DELETE review
router.delete("/:reviewId",isLoggedin,isReviewauthor, wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    // Remove reference from listing
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    // Delete review from collection
    await Review.findByIdAndDelete(reviewId);

    console.log(`Review ${reviewId} deleted`);
    res.redirect(`/listing/${id}`);
}));

module.exports = router;
