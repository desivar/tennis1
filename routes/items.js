// POST a new item
router.post('/', async (req, res) => {
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      quantity: req.body.quantity,
      category: req.body.category,
      manufacturer: req.body.manufacturer,
      releaseDate: req.body.releaseDate,
      isAvailable: req.body.isAvailable
    });
  
    try {
      const newItem = await item.save();
      res.status(201).json(newItem);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  