const express = require("express");
const router  = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
})

router.post("/signup",wrapAsync(async(req,res)=>{
   try{ let {username,email,password} = req.body;
    const newUser = new User({email,username});
    const registeredUser = await User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
         req.flash("Success","Welcome to ApnaPG");
         res.redirect("/");
    })
   
}catch{
    req.flash("error","Username alreaddy registered");
    res.redirect("/signup");
}
}));

//Login

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
})

router.post("/login",saveRedirectUrl, passport.authenticate("local",{ ///check karta hai ki user signed up hai ya nhi
    failureRedirect:"/login",
    failureFlash:true,
}),async(req,res)=>{
    req.flash("Success","Welcome to Apna PG,Logged in Successfully");
    let redirectUrl = res.locals.redirectUrl || "/";
    res.redirect(redirectUrl);

});

//Logout
router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("Success","You logged out successfully");
        res.redirect("/");
    });
})

module.exports = router;