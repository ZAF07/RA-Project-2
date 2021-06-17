export default function initUserModel(sequelize, DataTypes) {
  return sequelize.define(
    'user', {
      id: {
        allowNull: true,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
    },
    {
      underscored: true,
    },
  );
}
