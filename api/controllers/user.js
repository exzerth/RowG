const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { roles } = require("../roles");

exports.signup =  (req, res, next) => {
    User.findOne({email: req.body.email})
    .exec()
    .then(user => {
        if (user) {
            return res.status(423).json({
                message: "Email already exists"
            });
        } else {
            bcrypt.hash(req.body.password, 12, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        fullname: req.body.fullname,
                        ign: req.body.ign,
                        email: req.body.email,
                        password: hash,
                        role: req.body.role
                    });
                    if(!user.fullname || !user.ign || !user.email || !user.password){
                        return res.status(400).json({
                            status: false,
                            message: "All Fields Are Required"
                        });
                    } else if (user.role === "admin") {
                        return res.status(400).json({
                            status: false,
                            message: "You cannot sign up as admin"
                        });
                    }
                    user.save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: "User Created",
                            result: result
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
                }
            })
        }
    })
    
}

exports.login = (req, res, next) => {
    User.findOne({email: req.body.email})
    .exec()
    .then(user => {
        if(!user) {
            return res.status(401).json({
                message: "Auth Failed"
            });
        }
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if(err) {
                return res.status(401).json({
                    message: "Auth Failed"
                });
            }
            if(result) {
                req.session.email = user.email;
                req.session.role = user.role;

                const token = jwt.sign({
                    email: user.email,
                    userId: user._id,
                    role: user.role
                }, "moregandhi", {expiresIn: "1h"});
                User.findByIdAndUpdate(user._id, token)
                return res.status(200).json({
                    message: "Auth Successful",
                    token: token,
                    role: user.role
                });
            }
            res.status(401).json({
                message: "Auth Failed"
            });
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
}

exports.getAllUser = (req, res, next) => {
    User.find()
    .exec()
    .then(users => {
        console.log(users);
        res.status(200).json(users)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}

exports.deleteUser = (req, res, next) => {
    User.deleteOne({_id: req.params.userId})
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: "user deleted",
            result: result
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    })
}


exports.logout = (req, res, next) => {
    if (req.session) {
      req.session.destroy(function(err) {
        if(err) {
          return next(err);
        } else {
          return res.status(200).json({
              message: "Logout success"
          });
        }
      });
    }
}

/*exports.grantAccess = function(action, resource) {
    return async (req, res, next) => {
     try {
        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            fullname: req.body.fullname,
            ign: req.body.ign,
            email: req.body.email,
            role: req.body.role
        });
      const permission = roles.can(user.role)[action](resource);
      if (!permission.granted) {
       return res.status(401).json({
        error: "You don't have enough permission to perform this action"
       });
      }
      next()
     } catch (error) {
         console.log(error);
      next(error)
     }
    }
}*/


exports.allowIfLoggedin = async(req,res,next) => {
    try {
        const user = req.session.email;
            if (user) {
                next();
            } else {
                return res.status(401).json({
                    error: "You need to be logged in"
                });
            }
    } catch (err) {
        console.log(err)
    }
}

exports.grantAccess = async(req,res,next) => {
    try {
        const role = req.session.role;
            if (role === "admin") {
                next();
            } else {
                return res.status(401).json({
                    error: "You do not have permission"
                });
            }
    } catch (err) {
        console.log(err)
    }
}