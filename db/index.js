const { Sequelize, Model, DataTypes } = require("sequelize");
const db = new Sequelize(
  process.env.DATABASE_URL || "postgres://localhost/acme_auto_sales",
  {
    logging: false,
  }
);

class User extends Model {}

User.init(
  {
    name: {
      type: DataTypes.STRING,
    },
  },
  { sequelize: db, modelName: "users" }
);

class Car extends Model {}

Car.init(
  {
    name: {
      type: DataTypes.STRING,
    },
  },
  { sequelize: db, modelName: "cars" }
);

class Sale extends Model {}

Sale.init(
  {
    extendedWarranty: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  { sequelize: db, modelName: "sales" }
);

Sale.belongsTo(User);
User.hasMany(Sale);

Sale.belongsTo(Car);
Car.hasMany(Sale);

const syncAndSeed = async () => {
  try {
    await db.sync({ force: true });
    const [moe, lucy] = await Promise.all([
      User.create({ name: "Moe" }),
      User.create({ name: "Lucy" }),
    ]);
    const [Toyota, Honda] = await Promise.all(
      ["Toyota", "Honda"].map((name) => Car.create({ name }))
    );
    const sales = await Promise.all([
      Sale.create({ userId: moe.id, carId: Toyota.id }),
      Sale.create({ userId: lucy.id, carId: Honda.id, extendedWarranty: true }),
    ]);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  models: {
    User,
    Car,
    Sale,
  },
  db,
  syncAndSeed,
};
