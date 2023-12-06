const Category = require("../models/category");

class CategoryController {
  async create(req, res) {
    try {
      const { title, icon, image } = req.body;

      if (!title.trim() && !image.trim() && !icon.trim()) {
        res.status(400).json({ status: "title, image or icon empty" });
      }
      await new Category(req.body).save();

      res.status(201).json({ created: "true" });
    } catch (e) {
      console.log(e);
    }
  }

  async edit(req, res) {
    try {
      const { id, updatedData } = req.body;

      const category = await Category.findById(id);

      category.title = updatedData.title;
      category.image = updatedData.image;
      category.icon = updatedData.icon;

      await category.save();
      res.status(200).json({ saved: "true" });
    } catch (e) {
      console.log(e);
    }
  }
  async delete(req, res) {
    try {
      const { id } = req.body;

      const category = await Category.findByIdAndDelete(id);

      if (!category) {
        res.status(404).json({ status: "exists" });
      }

      res.status(200).json({ status: "ready" });
    } catch (e) {
      console.log(e);
    }
  }
  async all(req, res) {
    try {
      const categories = await Category.find();

      res.status(200).json({ categories });
    } catch (e) {
      console.log(e);
    }
  }
  async find(req, res) {
    try {
      const { id } = req.body;

      const category = await Category.findById(id);

      if (!category) {
        res.status(404).json({ status: "exists" });
      }

      res.status(200).json({ category });
    } catch (e) {
      console.log(e);
    }
  }
  async populate(req, res) {
    const { id } = req.body;

    const category = await Category.findById(id).populate("subcategories");

    if (!category) {
      res.status(404).json({ status: "exists" });
    }
    res.status(200).json({ category });
  }
  async actionBar(req, res) {
    const { id } = req.body;

    try {
      const category = await Category.findById(id)
        .populate({
          path: "subcategories",
          populate: {
            path: "sections",
          },
        })
        .exec();

      if (!category) {
        res.status(404).json({ status: "exists" });
        return;
      }

      res.status(200).json({ category });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = new CategoryController();
