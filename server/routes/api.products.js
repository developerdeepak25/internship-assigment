const multer = require("multer");
const Product = require("../model/product-model");
const checkAuth = require("../middleware/CheckAuth");

const router = require("express").Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// ** PUBLIC ROUTES

// Get all users

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products: products });
  } catch (error) {
    res.json({ message: "something went wrong" });
  }
});

// get singel user by id
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(404).json({ message: "id is required" });
      return;
    }
    const product = await Product.findOne({ _id: id });
    res.status(200).json({ product: product });
  } catch (error) {
    res.json({ message: "something went wrong" });
  }
});

// ** PRIVATE ROUTES

// middleware

router.use(checkAuth);

// create products
router.post("/", upload.single("image"), async (req, res) => {
  console.log("at top");
  try {
    const { name, price, category, inStock, image } = req.body;
    console.log(req.body);

    if (!name || !price || !category || !inStock) {
      return res.status(401).json({ message: "all fields are required" });
    }

    if(!req.file) {
      return res.status(401).json({ message: "image is required" });
    }
    const product = await Product.create({
      name,
      price,
      category,
      inStock,
      image: req.file.filename,
    });

    res.status(200).json({ message: "product created", product: product });
  } catch (error) {
    console.log(error);
    res.json({ message: "something went wrong" });
  }
});

// update product
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    if (!id) {
      res.status(404).json({ message: "id is required" });
      return;
    }
    const product = await Product.findOne({ _id: id });
    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }

    const { name, price, category, inStock, image } = req.body;

    if (!name || !price || !category || !inStock) {
      return res.status(401).json({ message: "all fields are required" });
    }

    product.name = name;
    product.price = price;
    product.category = category;
    product.inStock = inStock;

    if (req.file) {
      // If new file is uploaded, use the new filename
      product.image = req.file.filename;
    } else if (image) {
      // If image is provided as string (existing image), keep it
      product.image = image;
    }
    await product.save();
    res.status(200).json({ message: "product updated", product: product });
  } catch (err) {
    console.log(err);
    res.json({ message: "something went wrong" });
  }
});

// delete product
router.delete("/:id", async (req, res) => {
  console.log("here");
  try {
    const id = req.params.id;
    console.log(id);
    if (!id) {
      res.status(404).json({ message: "id is required" });
      return;
    }
    const product = await Product.findOne({ _id: id });
    if (!product) {
      console.log("product does not exist");
      return res.status(404).json({ message: "product not found" });
    }
    await Product.deleteOne({ _id: id });
    res.status(200).json({ message: "product deleted", product: product });
  } catch (err) {
    res.json({ message: "something went wrong" });
  }
});

module.exports = router;
