import { Sequelize } from "sequelize";
import { Config } from "../../types";
import { User } from "./user";
import { Restaurant } from "./restaurant";
import { Review } from "./review";
import configData from "../config/config";

const configs: Config = configData;
//임시
const env = "test";
const config = configs[env];

interface DB {
  [key: string]: any;
  sequelize?: Sequelize;
}

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password === null ? undefined : config.password,
  {
    host: config.host,
    dialect: "mysql",
  }
);
const db = {
  sequelize: sequelize,
  User: User,
  Review: Review,
  Restaurant: Restaurant,
};

db.User.initUser(sequelize);
db.Review.initReview(sequelize);
db.Restaurant.initRestaurant(sequelize);

db.User.hasMany(Review, { foreignKey: "user_id" });
db.Review.belongsTo(User, { foreignKey: "user_id" });
db.Restaurant.hasMany(Review, { foreignKey: "restaurant_name" });
db.Review.belongsTo(Restaurant, { foreignKey: "restaurant_name" });

export default db;
