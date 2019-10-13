const express = require('express');
const app = express();
const connectionString = process.env.DB || "mongodb+srv://cse110classconstructor:Gillespie110%21@cse110-da8qg.mongodb.net/cse110Project?retryWrites=true";
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const passport = require('passport');
const session = require('express-session')
const cookieSession = require('cookie-session');
//All our route dependencies
const UserRouter = require('./controller/routes/UserRoutes')
const AuthRouter = require('./controller/routes/auth-route');
const userAction = require('./controller/Action/UserAction');
const ActionUtil = require('./controller/Action/ActionUtil');
const LoginValidator = require('./controller/Authentication/LoginValidator')
const CourseRoutes = require('./controller/routes/CourseRoutes')
const QuarterRoutes = require('./controller/routes/QuarterRoutes')
const ScheduleRoutes = require('./controller/routes/ScheduleRoutes')
const ContactRoutes = require('./controller/routes/ContactRoutes')
const joshConnection = "mongodb://localhost/cse110Project"
const path = require('path');
const PORT = process.env.PORT || 5001;

//Set up connection to demodata mongoose database
mongoose.connect(connectionString, {useNewUrlParser : true}, (err) => {
    if(err){
        console.log(err);
    }
    else{
        console.log("connected to mongodb database");
    }
});

app.use(express.static(path.join(__dirname, 'React\ UI/cc_gui/build')));

app.use(cookieSession({
    name: "session",
    maxAge: 24 * 60 * 60 * 1000,
    keys: ["key"]
}));

app.use(bodyParser.json());


app.use('/auth', AuthRouter);

app.get("/logout", (req, res) => {
    req.session = null;
    res.send("logged out successfully");
})

app.use(LoginValidator.isLoggedIn); //This is used to authenticate all of our routes

//Define the routes
app.get("/", (req, res) => {
    //res.send("Hello world");
    res.send(req.session)
});

app.get('/in', (req, res) => {
    res.json({"one" : "two"});
})


app.use('/user', UserRouter);
app.use('/contact', ContactRoutes);

//course routes
app.use('/course', CourseRoutes);
app.use('/quarter' , QuarterRoutes);
app.use('/schedule' , ScheduleRoutes);
app.listen(PORT, (req, res)=>{

    console.log("connected on port 5001");

});
