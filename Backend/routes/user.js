const express = require("express");
const router  = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const cors = require("cors");

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json()); // <-- very important


router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
})

router.post("/signup", wrapAsync(async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);
      return res.json({
        success: true,
        message: "Welcome to ApnaPG",
        user: {
          id: registeredUser._id,
          username: registeredUser.username,
          email: registeredUser.email,
        },
      });
    });
  } catch (e) {
    res.status(400).json({ success: false, message: "Username already registered" });
  }
}));


//Login

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
})

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ success: false, message: info?.message || "Invalid credentials" });
    }

    req.login(user, (err) => {
      if (err) return next(err);
      return res.json({
        success: true,
        message: "Logged in successfully",
        user: { id: user._id, username: user.username, email: user.email },
      });
    });
  })(req, res, next);
});


// Get current logged-in user
router.get("/current-user", (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({
      success: true,
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
      },
    });
  } else {
    return res.json({ success: false, user: null });
  }
});

//Logout
router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    return res.json({ success: true, message: "Logged out successfully" });
  });
});

module.exports = router;