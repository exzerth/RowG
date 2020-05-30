const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userSchema = new schema({
    _id: mongoose.Schema.ObjectId,
    fullname: {
        type: String,
        require: true
    },
    ign: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    },
    password: {
        type: String,
        require: true
    },
    role: {
        type: String,
        default: "gamer",
        enum: ["admin", "gamer"],
    },
}, {timestamps: true});

module.exports = mongoose.model("User", userSchema);