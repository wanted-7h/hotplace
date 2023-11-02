import {
  DataTypes,
  Model,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  declare id: CreationOptional<number>;
  declare user_id: CreationOptional<string>;
  declare lat: CreationOptional<number>;
  declare lon: CreationOptional<number>;
  declare is_recommend_lunch: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export const initUser = (sequelize: Sequelize): void => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      lat: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      lon: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      is_recommend_lunch: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      modelName: "User",
      tableName: "user",
      timestamps: true,
      charset: "utf8",
      collate: "utf8_general_ci",
      sequelize,
    }
  );
};
