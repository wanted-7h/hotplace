import { Sequelize } from "sequelize";
import { Config } from "../../types";
import { User, initUser } from "./user";
import { Restaurant, initRestaurant } from "./restaurant";
import { Review, initReview } from "./review";
import configData from "../config/config";

const configs: Config = configData;
//임시
const env = "development";
const config = configs[env];

interface DB {
  [key: string]: any;
  sequelize?: Sequelize;
}

const db: DB = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password === null ? undefined : config.password,
  {
    host: config.host,
    dialect: "mysql",
  }
);

initUser(sequelize);
initRestaurant(sequelize);
initReview(sequelize);

User.hasMany(Review, { foreignKey: "user_id" });
Review.belongsTo(User, { foreignKey: "user_id" });
Restaurant.hasMany(Review, { foreignKey: "restaurant_name" });
Review.belongsTo(Restaurant, { foreignKey: "restaurant_name" });

export default sequelize;
