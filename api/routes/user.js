const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");



router.post("/signup", userController.signup);

router.post("/login", userController.login);

router.get("/users", userController.allowIfLoggedin, userController.getAllUser);

router.delete("/:userId", userController.allowIfLoggedin, userController.grantAccess, userController.deleteUser);

router.get("/logout", userController.logout);
    




module.exports = router;