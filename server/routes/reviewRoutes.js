const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const auth = require("../middleware/auth");

router.post("/", auth, reviewController.createReview);
router.get("/session/:sessionId", reviewController.getReviewsForSession);

module.exports = router;