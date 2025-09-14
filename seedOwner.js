const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./module/user");

mongoose.connect("mongodb://127.0.0.1:27017/Pet_Portal")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

async function seedOwners() {
  const owners = [
    { username: "Owner1", email: "owner1@mail.com", password: "owner123", role: "owner" },
    { username: "Owner2", email: "owner2@mail.com", password: "owner123", role: "owner" },
    { username: "Owner3", email: "owner3@mail.com", password: "owner123", role: "owner" },
  ];

  for (let owner of owners) {
    const exists = await User.findOne({ email: owner.email });
    if (!exists) {
      const hashedPass = await bcrypt.hash(owner.password, 10);
      const newOwner = new User({ ...owner, password: hashedPass });
      await newOwner.save();
      console.log(`Created owner: ${owner.email}`);
    } else {
      console.log(`Owner already exists: ${owner.email}`);
    }
  }

  mongoose.connection.close();
}
seedOwners();
