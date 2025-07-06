if(process.env.NODE_ENV !="production"){
 require("dotenv").config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("../ApnaPG/models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-Mate");
const wrapAsync = require("./utils/wrapAsync.js");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const userRouter = require('./routes/user.js');
const listingcontroller = require("./controllers/listing.js");
const multer  = require('multer')

const dbUrl = process.env.ATLASDB_URL;

//Authentication
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:"Parle-g",
    },
    touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("Error in MONGO SESSION STORE", err);
});

const sessionoption = {
    store,
    secret:"Parle-g",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000, //Login id kitne din tak rahega
        maxAge: 7*24*60*60*1000,
    },
}

//Api integration learning
const cors = require("cors");
const { wrap } = require("module");
app.use(cors()); // allow requests from frontend




// const Mongo_URL = "mongodb://127.0.0.1:27017/ApnaPG";


main().then(()=>{
    console.log("Connection Established");
}).catch(err=>{
    console.log(err);
    }
)
async function main(){
    await mongoose.connect(dbUrl);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method")); //To convert Post to put,Delete request
app.engine('ejs',ejsMate); //npm ejs mate package
app.use(express.static(path.join(__dirname,"/public")));


app.use(session(sessionoption)); //session use to save data in browser if we change page
app.use(flash()); //used to send messages

//session ke just baad aayega ye authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("Success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next(); ///using flash messages
})


app.use("/listing", require("./routes/listing.js"));
app.use("/listing/:id/reviews",require("./routes/Review.js"));
app.use("/",userRouter);





app.get("/",wrapAsync(listingcontroller.index));


app.get("/demo",async(req,res)=>{
    let fakeUser = new User({
        email:"arnavgoswami@gamil.com",
        username:"Arnav_420",
    });

    let registeredUser = await User.register(fakeUser,"helloworld");
    res.send(registeredUser);
})

// Api integration learning
app.get("/api/listings", wrapAsync(async (req, res) => {
    const alllisting = await Listing.find({});
    res.json(alllisting); // <-- send JSON instead of rendering EJS
}));

// app.all("*",(req,res,next)=>{
//     next(new ExpressError(404,"Page Not found"));
// });

app.use((err,req,res,next)=>{
    let {statusCode=500,message} = err;
    res.status(statusCode).send(message);
});

app.listen(8080,()=>{
    console.log("Server is listening on port 8080");
})