const SkillListing = require("../models/SkillListing");

exports.createListing = async (req, res, next) => {
  try {
    const { type, skillName, category, description } = req.body;

    if (!type || !skillName || !category) {
      return res.status(400).json({ message: "type, skillName, and category are required" });
    }

    const listing = await SkillListing.create({
      userId: req.userId,
      type,
      skillName,
      category,
      description,
    });

    res.status(201).json(listing);
  } catch (err) {
    next(err);
  }
};

exports.getListings = async (req, res, next) => {
  try {
    const { category, type, q } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = { $regex: new RegExp(`^${category}$`, "i") };
    if (type) filter.type = type;
    if (q) filter.skillName = { $regex: new RegExp(q, "i") };

    const listings = await SkillListing.find(filter).populate("userId", "name email avgRating ratingCount");
    res.json(listings);
  } catch (err) {
    next(err);
  }
};

exports.updateListing = async (req, res, next) => {
  try {
    const listing = await SkillListing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    if (listing.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized to edit this listing" });
    }

    const { skillName, category, description, isActive } = req.body;
    if (skillName !== undefined) listing.skillName = skillName;
    if (category !== undefined) listing.category = category;
    if (description !== undefined) listing.description = description;
    if (isActive !== undefined) listing.isActive = isActive;

    await listing.save();
    res.json(listing);
  } catch (err) {
    next(err);
  }
};

exports.deleteListing = async (req, res, next) => {
  try {
    const listing = await SkillListing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    if (listing.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized to delete this listing" });
    }

    await listing.deleteOne();
    res.json({ message: "Listing deleted" });
  } catch (err) {
    next(err);
  }
};
exports.getMyListings = async (req, res, next) => {
  try {
    const listings = await SkillListing.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    next(err);
  }
};