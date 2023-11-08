import { Sequelize } from "sequelize";
import { User } from "./user";
import { Restaurant } from "./restaurant";
import { Review } from "./review";
import { dbSchema } from "../../env";

const config = dbSchema.parse(process.env);
const sequelize = new Sequelize(config);

await sequelize
  .sync({
    force: false, //임시
  })
  .then(() => console.log("sequelize is connected"))
  .catch((err) => console.error("sequelize error:", err));

const db = { sequelize, User, Review, Restaurant };

db.User.initUser(sequelize);
db.Review.initReview(sequelize);
db.Restaurant.initRestaurant(sequelize);

db.User.hasMany(Review, { foreignKey: "user_id" });
db.Review.belongsTo(User, { foreignKey: "user_id" });
db.Restaurant.hasMany(Review, { foreignKey: "restaurant_name" });
db.Review.belongsTo(Restaurant, { foreignKey: "restaurant_name" });

export default db;
