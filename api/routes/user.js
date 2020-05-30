const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");



router.post("/signup", userController.signup);

router.post("/login", userController.login);

router.get("/users", userController.getAllUser);

router.delete("/:userId", userController.deleteUser);
    




module.exports = router;