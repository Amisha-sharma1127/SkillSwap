const Review = require("../models/Review");
const Session = require("../models/Session");
const User = require("../models/user");

exports.createReview = async (req, res, next) => {
  try {
    const { sessionId, rating, comment } = req.body;
    if (!sessionId || !rating) {
      return res.status(400).json({ message: "sessionId and rating are required" });
    }

    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });
    if (session.status !== "completed") {
      return res.status(400).json({ message: "Can only review completed sessions" });
    }

    const isParticipant = [session.teacherId.toString(), session.learnerId.toString()].includes(req.userId);
    if (!isParticipant) {
      return res.status(403).json({ message: "Only session participants can leave a review" });
    }

    const revieweeId = session.teacherId.toString() === req.userId ? session.learnerId : session.teacherId;

    const review = await Review.create({
      sessionId,
      reviewerId: req.userId,
      revieweeId,
      rating,
      comment,
    });

    // Recompute the reviewee's average rating
    const stats = await Review.aggregate([
      { $match: { revieweeId: review.revieweeId } },
      { $group: { _id: "$revieweeId", avg: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);

    if (stats.length > 0) {
      await User.findByIdAndUpdate(revieweeId, {
        avgRating: Math.round(stats[0].avg * 10) / 10,
        ratingCount: stats[0].count,
      });
    }

    res.status(201).json(review);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "You already reviewed this session" });
    }
    next(err);
  }
};

exports.getReviewsForSession = async (req, res, next) => {
  try {
    const reviews = await Review.find({ sessionId: req.params.sessionId }).populate("reviewerId", "name");
    res.json(reviews);
  } catch (err) {
    next(err);
  }
};