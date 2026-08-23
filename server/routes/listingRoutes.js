const express = require("express");
const router = express.Router();
const listingController = require("../controllers/listingController");
const auth = require("../middleware/auth");

router.get("/", listingController.getListings);
router.get("/mine", auth, listingController.getMyListings);
router.post("/", auth, listingController.createListing);
router.patch("/:id", auth, listingController.updateListing);
router.delete("/:id", auth, listingController.deleteListing);

module.exports = router;