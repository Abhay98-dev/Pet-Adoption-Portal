const mongoose = require("mongoose");
const Pet = require("./module/pet_info");

mongoose.connect("mongodb://127.0.0.1:27017/Pet_Portal")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

const samplePets = [
  {
    name: "Whiskers",
    type: "Cat",
    description: "A playful and curious kitten who loves chasing toys.",
    breed: "Persian",
    image: "/images/cat1.jpg"
  },
  {
    name: "Luna",
    type: "Cat",
    description: "A gentle cat who enjoys naps in sunny spots.",
    breed: "Siamese",
    image: "/images/cat2.jpg"
  },
  {
    name: "Max",
    type: "Dog",
    description: "Friendly and energetic, loves going on long walks.",
    breed: "Labrador",
    image: "/images/dog1.jpg"
  },
  {
    name: "Bella",
    type: "Dog",
    description: "Sweet and loyal, perfect for families with kids.",
    breed: "Beagle",
    image: "/images/dog2.jpg"
  },
  {
    name: "Rocky",
    type: "Dog",
    description: "Protective but gentle, a great companion for outdoors.",
    breed: "German Shepherd",
    image: "/images/dog3.jpg"
  },
  {
    name: "Daisy",
    type: "Dog",
    description: "Calm and cuddly, loves being around people.",
    breed: "Pug",
    image: "/images/dog4.jpg"
  }
];

async function seedDB() {
  try {
    await Pet.deleteMany({});
    console.log("Old data deleted");

    await Pet.insertMany(samplePets);
    console.log("New pets inserted");

    mongoose.connection.close();
  } catch (err) {
    console.error(err);
  }
}

seedDB();
