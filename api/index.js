const {
  models: { User, Car, Sale },
} = require("../db");
const router = require("express").Router();

router.get("/users", async (req, res, next) => {
  try {
    res.send(await User.findAll());
  } catch (error) {
    next(error);
  }
});

router.get("/cars", async (req, res, next) => {
  try {
    res.send(await Car.findAll());
  } catch (error) {
    next(error);
  }
});

router.get("/users/:id/sales", async (req, res, next) => {
  try {
    const sales = await Sale.findAll({
      where: {
        userId: req.params.id,
      },
      include: [Car],
    });
    res.send(sales);
  } catch (error) {
    next(error);
  }
});

router.post("/users/:id/sales", async (req, res, next) => {
  try {
    let sale = await Sale.create({ ...req.body, userId: req.params.id });
    sale = await Sale.findByPk(sale.id, { include: [Car] });
    res.send(sale);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
