const router = require("express").Router();
const jwt = require("jsonwebtoken");

// lOGIN USER

router.post("/login", async (req, res) => {
  console.log("here");
  const ADMIN_NAME = process.env.ADMIN_NAME;
  const ADMIN_PASS = process.env.ADMIN_PASS;
  try {
    const { name, password } = req.body;
    console.log(req.body);
    if (name !== ADMIN_NAME || password !== ADMIN_PASS) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }
    const token = await jwt.sign({ name: name }, process.env.TOKEN_SECRET, {
      expiresIn: "7d",
    });
    // Set the cookie first
    res.cookie("token", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.status(200).json({ message: "loged in sucessfully" });
    // .cookie("token", token, {
    //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    // });
  } catch (err) {
    console.log("in error block");

    res.status(401).json({ message: "Authentication problem!!" });
    console.log(err);
  }
});

module.exports = router;
