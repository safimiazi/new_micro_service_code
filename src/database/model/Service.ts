import { DataTypes, Model, Optional, Sequelize } from "sequelize";

// Define the attributes for ServiceInfo
interface ServiceInfo {
  id: number; // Primary key
  serviceName: string;
  from: string;
  to: string;
  vehicleType: string;
  serviceRate: number;
  seatNumber: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the optional attributes for creation

// Function to define the Service model
export function ServiceModel(sequelize: Sequelize) {
  return sequelize.define(
    "service",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      serviceName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      from: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      to: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      vehicleType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      serviceRate: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      seatNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "services", // Specify the table name explicitly
      timestamps: true, // Enable automatic `createdAt` and `updatedAt`
    }
  );
}
