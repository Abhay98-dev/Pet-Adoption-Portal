const express = require("express");
const router = express.Router();
const Pet = require("../module/pet_info");
const verifyToken = require("../middleware/verifyToken");
const checkRole = require("../middleware/checkRole");

// Public: anyone can see pets
router.get("/", async (req, res) => {
  try {
    const data = await Pet.find();
    res.json(data);
  } catch (err) {
    console.error("Error fetching pets:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Owner only: add new pet
router.post("/", verifyToken, checkRole("owner"), async (req, res) => {
  const { name, type, description, breed, image } = req.body;
  if (!name || !type || !description || !breed || !image) {
    return res.status(400).json({ error: "All fields must be filled" });
  }
  try {
    const newPet = new Pet({ name, type, description, breed, image });
    const savePet = await newPet.save();
    res.status(201).json({ message: "Pet created successfully", pet: savePet });
  } catch (err) {
    console.error("Error creating pet:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Owner only: update pet
router.put("/:id", verifyToken, checkRole("owner"), async (req, res) => {
  const { name, type, description, breed, image } = req.body;
  const petId = req.params.id;

  if (!name || !type || !description || !breed || !image) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    const updatedPet = await Pet.findByIdAndUpdate(
      petId,
      { name, type, description, breed, image },
      { new: true }
    );

    res.status(200).json({ message: "Pet updated", pet: updatedPet });
  } catch (err) {
    console.error("Error updating pet:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Owner only: delete pet
router.delete("/:id", verifyToken, checkRole("owner"), async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    await Pet.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Pet deleted successfully" });
  } catch (err) {
    console.error("Error deleting pet:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
