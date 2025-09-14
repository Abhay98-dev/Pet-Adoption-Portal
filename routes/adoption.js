const express = require("express");
const router = express.Router();
const Adoption = require("../module/adoption");
const Pet = require("../module/pet_info");
const verifyToken = require("../middleware/verifyToken");
const checkRole = require("../middleware/checkRole");

// Buyer requests adoption
router.post("/:petId", verifyToken,checkRole("buyer"), async (req, res) => {
  try {
    const { petId } = req.params;

    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    const adoption = new Adoption({
      pet: petId,
      adopter: req.user.userId // comes from verifyToken middleware
    });

    await adoption.save();
    res.status(201).json({ message: "Adoption request submitted", adoption });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Owner views all adoption requests
router.get("/", verifyToken, async (req, res) => {
  try {
    const requests = await Adoption.find()
      .populate("pet")
      .populate("adopter", "username email");

    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Owner updates request status
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const adoption = await Adoption.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("pet adopter");

    if (!adoption) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.json({ message: "Adoption request updated", adoption });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
