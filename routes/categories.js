const express = require("express");
const router = express.Router();
const Category = require("../models/categories_schema");
const Slugyfy = require("slugify");

//Get all categories with populate
router.get("/all", async (req, res) => {
  try {
    const categories = await Category.find({isSubcategory: false}).populate([
      {
        path: "subcategories",
      }
    ]);

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().lean();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get one category
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).lean();
    if (!category) {
      return res
        .status(404)
        .json({ message: "Category not found", status: "error" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Create One
router.post("/", async (req, res) => {
  
  //Create slug with remove spaces and lowercase
  const slug = Slugyfy(req.body.name, {
    lower: true,
    remove: /[*+~.()'"!:@_]/g,
  });

  const category = new Category({
    name: req.body.name,
    slug: slug,
    description: req.body.description,
    image: req.body.image,
    publisher: "harsha web",
  });
  try {
    await category.save();
    res
      .status(201)
      .json({ message: "Category created successfully", status: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});

//Update One
router.patch("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res
        .status(404)
        .json({ message: "Category not found", status: "error" });
    }

    category.name = req.body.name;
    category.description = req.body.description;
    category.image = req.body.image;
    await category.save();
    res
      .status(200)
      .json({ message: "Category updated successfully", status: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Delete One
router.delete("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res
        .status(404)
        .json({ message: "Category not found", status: "error" });
    }
    await category.remove();
    res
      .status(200)
      .json({ message: "Category deleted successfully", status: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}); 

module.exports = router;