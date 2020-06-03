const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);


//connect mongodb
mongoose.connect("mongodb+srv://rowg:Rowg152%24@rowg-rtptn.gcp.mongodb.net/test?retryWrites=true&w=majority",{ useNewUrlParser: true, useUnifiedTopology: true })
.then(_result => {
console.log("Database connected");
let port_number = app.listen(process.env.PORT || 3000);
app.listen(port_number);
}).catch(err => console.log(err));

//create a default admin
require("./admin");

mongoose.Promise = global.Promise;
const db = mongoose.connection


const app = express();
app.use(session({
    secret: 'gandhi',
    resave: 'false',
    saveUninitialized: 'true',
    store: new MongoStore({ mongooseConnection: db })
}));

const userRoutes = require("./api/routes/user");


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

//load css and images
app.use(express.static(__dirname + '/public'));

//get routes
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname + '/index.html'));
});
app.get('/signup', (req, res) => {
	res.sendFile(path.join(__dirname + '/signup.html'));
});
app.get('/login', (req, res) => {
	res.sendFile(path.join(__dirname + '/login.html'));
});


//routes
app.use("/", userRoutes);

//error handling middleware
app.use((req, res, next) => {
    const error = new Error("No Request");
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});


/*app.use(async (req, res, next) => {
    if (req.headers["x-access-token"]) {
     const token = req.headers["x-access-token"];
     const { userId, exp } = await jwt.verify(token, "moregandhi");
     // Check if token has expired
     if (exp < Date.now().valueOf() / 1000) { 
      return res.status(401).json({ error: "JWT token has expired, please login to obtain a new one" });
     } 
     res.locals.loggedInUser = await User.findById(userId); next(); 
    } else { 
     next(); 
    } 
});*/


//handle cors errors
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});