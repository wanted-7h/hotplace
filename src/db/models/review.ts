import {
  DataTypes,
  Model,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

export class Review extends Model<
  InferAttributes<Review>,
  InferCreationAttributes<Review>
> {
  declare id: CreationOptional<number>;
  declare user_id: CreationOptional<string>;
  declare restaurant_name: CreationOptional<string>;
  declare grade: CreationOptional<number>;
  declare detail: CreationOptional<string>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  static initReview = (sequelize: Sequelize): void => {
    Review.init(
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
        },
        restaurant_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        grade: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        detail: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      {
        modelName: "Review",
        tableName: "review",
        timestamps: true,
        charset: "utf8",
        collate: "utf8_general_ci",
        sequelize,
      }
    );
  };
}
