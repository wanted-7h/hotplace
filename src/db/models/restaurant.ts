import {
  DataTypes,
  Model,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

export class Restaurant extends Model<
  InferAttributes<Restaurant>,
  InferCreationAttributes<Restaurant>
> {
  declare id: CreationOptional<number>;
  declare restaurant_name: CreationOptional<string>;
  declare restaurant_type: CreationOptional<string>;
  declare adress: CreationOptional<string>;
  declare lat: CreationOptional<number>;
  declare lon: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  static initRestaurant = (sequelize: Sequelize): void => {
    Restaurant.init(
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        restaurant_name: {
          type: DataTypes.STRING,
          allowNull: false,
          primaryKey: true,
        },
        restaurant_type: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        adress: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        lat: {
          type: DataTypes.DOUBLE,
          allowNull: false,
        },
        lon: {
          type: DataTypes.DOUBLE,
          allowNull: false,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      {
        modelName: "Restaurant",
        tableName: "restaurant",
        charset: "utf8",
        collate: "utf8_general_ci",
        timestamps: true,
        sequelize,
      }
    );
  };
}