const express = require("express");
const router = express.Router();
const sessionController = require("../controllers/sessionController");
const auth = require("../middleware/auth");

router.post("/request", auth, sessionController.requestSession);
router.patch("/:id/confirm", auth, sessionController.confirmSession);
router.patch("/:id/complete", auth, sessionController.completeSession);
router.patch("/:id/cancel", auth, sessionController.cancelSession);
router.get("/mine", auth, sessionController.getMySessions);
router.patch("/:id/accept", auth, sessionController.acceptOffer);
router.patch("/:id/decline", auth, sessionController.declineOffer);
module.exports = router;