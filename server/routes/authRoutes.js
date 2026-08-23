const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middleware/auth"); 

console.log('auth middleware type:', typeof auth);
console.log('authController.getProfile type:', typeof authController.getProfile);

router.post("/register", authController.register);
router.post("/login", authController.login);

router.get("/profile", auth, authController.getProfile);

module.exports = router;