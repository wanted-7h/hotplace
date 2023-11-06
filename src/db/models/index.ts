import { Sequelize } from "sequelize";
import { User } from "./user";
import { Restaurant } from "./restaurant";
import { Review } from "./review";
import configs from "../config/config";

//임시
const env = "test";
const config = configs[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password === null ? undefined : config.password,
  {
    host: config.host,
    dialect: "mysql",
  },
);
const db = { sequelize, User, Review, Restaurant };

db.User.initUser(sequelize);
db.Review.initReview(sequelize);
db.Restaurant.initRestaurant(sequelize);

db.User.hasMany(Review, { foreignKey: "user_id" });
db.Review.belongsTo(User, { foreignKey: "user_id" });
db.Restaurant.hasMany(Review, { foreignKey: "restaurant_name" });
db.Review.belongsTo(Restaurant, { foreignKey: "restaurant_name" });

export default db;
