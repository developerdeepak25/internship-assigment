const { getDataFromToken } = require("../utils");

function checkAuth(req, res, next) {
  console.log('inside auth')
  try {
    const name = getDataFromToken(req);
    console.log(name)
    if (!name) return res.status(401).json({ message: "Unauthorized" });
    if (name !== process.env.ADMIN_NAME)
      return res.status(401).json({ message: "Unauthorized" });
    console.log("user is authenticated");
    next();
  } catch (err) {
    console.log(err)
    res.status(401).json({ message: "Authentication problem!!" });
  }
}

module.exports =  checkAuth 
