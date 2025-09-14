const express= require("express")
const router = express.Router()
const User=require("../module/user")
require("dotenv").config()
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")

const saltRounds=10

router.use(express.urlencoded({extended:true}))
router.use(express.json())

router.get("/",(req,res)=>{
    res.render("login.ejs")
})

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All the fields are required" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: "User Already Exists!" });
  }

  const hashedPass = await bcrypt.hash(password, saltRounds);

  try {
    const user = new User({
      username,
      email,
      password: hashedPass,
      role: "buyer"   // ✅ always buyer
    });

    await user.save();
    return res.status(201).json({ message: "User created", user });
  } catch (err) {
    console.log("Error registering new User: ", err);
    return res.status(500).json({ message: "Internal server Error" });
  }
});




// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("All fields are required");
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send("User not found");

    const isPassValid = await bcrypt.compare(password, user.password);
    if (!isPassValid) return res.status(401).send("Invalid password");

    // ✅ Create JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // ✅ Save JWT in cookie
    res.cookie("token", token, { httpOnly: true });

    // ✅ Redirect based on role
    if (user.role === "owner") {
      return res.redirect("/dashboard");
    } else {
      return res.redirect("/pet");
    }
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).send("Internal Server Error");
  }
});



module.exports=router