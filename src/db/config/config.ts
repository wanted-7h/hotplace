import dotenv from "dotenv";
dotenv.config();

const config = {
  development: {
    username: process.env.DB_USER_NAME || "hotplace_user",
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_DATABASE || "hotplace",
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
  },
  // test: {
  //   username: "root",
  //   password: null,
  //   database: "database_test",
  //   host: "127.0.0.1",
  //   dialect: "mysql",
  // },
  // production: {
  //   username: "root",
  //   password: null,
  //   database: "database_production",
  //   host: "127.0.0.1",
  //   dialect: "mysql",
  // },
};

export default config;
