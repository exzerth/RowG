const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
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
	res.sendFile(path.join(__dirname + '/createaccount.html'));
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

//connect mongodb
mongoose.connect("mongodb+srv://rowg:Rowg152%24@rowg-rtptn.gcp.mongodb.net/test?retryWrites=true&w=majority",{ useNewUrlParser: true, useUnifiedTopology: true })
.then(_result => {
console.log("Database connected");
let port_number = app.listen(process.env.PORT || 3000);
app.listen(port_number);
}).catch(err => console.log(err));

//create a default admin
require("./admin");


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