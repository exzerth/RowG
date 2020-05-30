const User = require("./api/models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");



User.findOne({email: "admin@gmail.com"})
.exec()
.then(user => {
    if (user) {
        return
    } else {
        bcrypt.hash("admin", 12, (err, hash) => {
            if (err) {
                return res.status(500).json({
                    error: err
                });
            } else {
                const user = {
                    _id: new mongoose.Types.ObjectId(),
                    fullname: "Administrator",
                    ign: "Nokigaru",
                    email: "admin@gmail.com",
                    password: hash,
                    role: "admin"
                }
                
                User.create(user, function(e) {
                    if (e) {
                        throw e;
                    }
                });
            }
        });
    }
})
.catch(err => {
    console.log(err);
});

