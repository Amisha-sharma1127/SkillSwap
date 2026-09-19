const Session = require("../models/Session");
const Transaction = require("../models/Transaction");
const SkillListing = require("../models/SkillListing");
const User = require("../models/user");

// 1. Request a session
exports.requestSession = async (req, res, next) => {
  try {
    const { skillListingId, scheduledAt, creditsAgreed, iAmTeaching } = req.body;

    if (!skillListingId || !scheduledAt || !creditsAgreed) {
      return res.status(400).json({ message: "skillListingId, scheduledAt, and creditsAgreed are required" });
    }

    const listing = await SkillListing.findById(skillListingId);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    // Default: listing owner teaches (offer listings). If iAmTeaching is true
    // (used for "want" listings), the roles flip — the requester teaches instead.
    const teacherId = iAmTeaching ? req.userId : listing.userId;
    const learnerId = iAmTeaching ? listing.userId : req.userId;

    if (teacherId.toString() === learnerId.toString()) {
      return res.status(400).json({ message: "You cannot request a session with yourself" });
    }

    const learner = await User.findById(learnerId);
    if (learner.creditBalance < creditsAgreed) {
      return res.status(400).json({ message: "The learner does not have enough credits for this session" });
    }

    const session = await Session.create({
      teacherId,
      learnerId,
      skillListingId,
      creditsAgreed,
      scheduledAt,
      status: iAmTeaching ? "offered" : "requested",
    });

    res.status(201).json(session);
  } catch (err) {
    next(err);
  }
};
// Learner accepts a teaching offer — moves it into the normal flow
exports.acceptOffer = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: "Session not found" });

    if (session.learnerId.toString() !== req.userId) {
      return res.status(403).json({ message: "Only the learner can accept this offer" });
    }
    if (!["requested", "offered"].includes(session.status)) {
      return res.status(400).json({ message: `Cannot confirm a session with status '${session.status}'` });
    }

    const updatedLearner = await User.findOneAndUpdate(
      { _id: session.learnerId, creditBalance: { $gte: session.creditsAgreed } },
      { $inc: { creditBalance: -session.creditsAgreed } },
      { new: true }
    );
    if (!updatedLearner) {
      return res.status(400).json({ message: "You do not have enough credits to accept this offer" });
    }

    session.status = "confirmed";
    await session.save();

    await Transaction.create({
      sessionId: session._id,
      fromUserId: session.learnerId,
      toUserId: session.teacherId,
      amount: session.creditsAgreed,
      type: "hold",
    });

    res.json(session);
  } catch (err) {
    next(err);
  }
};

// Learner declines a teaching offer
exports.declineOffer = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: "Session not found" });

    if (session.learnerId.toString() !== req.userId) {
      return res.status(403).json({ message: "Only the learner can decline this offer" });
    }
    if (session.status !== "offered") {
      return res.status(400).json({ message: `Cannot decline a session with status '${session.status}'` });
    }

    session.status = "declined";
    await session.save();
    res.json(session);
  } catch (err) {
    next(err);
  }
};
// 2. Teacher confirms — this is where credits get HELD
exports.confirmSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: "Session not found" });

    if (session.teacherId.toString() !== req.userId) {
      return res.status(403).json({ message: "Only the teacher can confirm this session" });
    }
    if (session.status !== "requested") {
      return res.status(400).json({ message: `Cannot confirm a session with status '${session.status}'` });
    }

    const updatedLearner = await User.findOneAndUpdate(
      { _id: session.learnerId, creditBalance: { $gte: session.creditsAgreed } },
      { $inc: { creditBalance: -session.creditsAgreed } },
      { new: true }
    );

    if (!updatedLearner) {
      return res.status(400).json({ message: "Learner no longer has sufficient credits" });
    }

    session.status = "confirmed";
    await session.save();

    await Transaction.create({
      sessionId: session._id,
      fromUserId: session.learnerId,
      toUserId: session.teacherId,
      amount: session.creditsAgreed,
      type: "hold",
    });

    res.json(session);
  } catch (err) {
    next(err);
  }
};

// 3. Mark complete — RELEASE credits to the teacher
exports.completeSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: "Session not found" });

    const isParticipant = [session.teacherId.toString(), session.learnerId.toString()].includes(req.userId);
    if (!isParticipant) {
      return res.status(403).json({ message: "Only session participants can mark it complete" });
    }
    if (session.status !== "confirmed") {
      return res.status(400).json({ message: `Cannot complete a session with status '${session.status}'` });
    }

    await User.findByIdAndUpdate(session.teacherId, { $inc: { creditBalance: session.creditsAgreed } });

    session.status = "completed";
    await session.save();

    await Transaction.create({
      sessionId: session._id,
      fromUserId: session.learnerId,
      toUserId: session.teacherId,
      amount: session.creditsAgreed,
      type: "release",
    });

    res.json(session);
  } catch (err) {
    next(err);
  }
};

// 4. Cancel — REFUND credits to the learner if they were held
exports.cancelSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: "Session not found" });

    const isParticipant = [session.teacherId.toString(), session.learnerId.toString()].includes(req.userId);
    if (!isParticipant) {
      return res.status(403).json({ message: "Only session participants can cancel it" });
    }
    if (!["requested", "confirmed"].includes(session.status)) {
      return res.status(400).json({ message: `Cannot cancel a session with status '${session.status}'` });
    }

    if (session.status === "confirmed") {
      await User.findByIdAndUpdate(session.learnerId, { $inc: { creditBalance: session.creditsAgreed } });

      await Transaction.create({
        sessionId: session._id,
        fromUserId: session.teacherId,
        toUserId: session.learnerId,
        amount: session.creditsAgreed,
        type: "refund",
      });
    }

    session.status = "cancelled";
    await session.save();

    res.json(session);
  } catch (err) {
    next(err);
  }
};

// Get sessions for the logged-in user (as teacher or learner)
exports.getMySessions = async (req, res, next) => {
  try {
    const sessions = await Session.find({
      $or: [{ teacherId: req.userId }, { learnerId: req.userId }],
    })
      .populate("teacherId", "name email")
      .populate("learnerId", "name email")
      .populate("skillListingId", "skillName category")
      .sort({ createdAt: -1 });
    res.json(sessions);
  } catch (err) {
    next(err);
  }
};