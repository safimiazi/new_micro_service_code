import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

export interface LoiAgencyI
  extends Model<
    InferAttributes<LoiAgencyI>,
    InferCreationAttributes<LoiAgencyI>
  > {
  id: CreationOptional<string>;
  email: string;
  name: string;
  phone: string;
  logo: string;
  banner: string;
  address: string;
  signature: string;
  sill: string;
  UEN: string;
  name_NRIC: string;
  default: boolean;
  status?: "active" | "deactivated" | "block" | "non_verify";
  createdAt?: Date;
  updatedAt?: Date;
}

export function LoiAgencyModel(sequelize: Sequelize) {
  return sequelize.define<LoiAgencyI>("loi_agency", {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      allowNull: false,
      type: DataTypes.STRING(255),
    },
    logo: {
      allowNull: false,
      type: DataTypes.STRING(255),
    },
    address: {
      allowNull: false,
      type: DataTypes.STRING(255),
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },

    banner: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    signature: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    sill: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    UEN: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    name_NRIC: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    default: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    status: {
      allowNull: false,
      type: DataTypes.ENUM("active", "deactivated", "block", "non_verify"),
      defaultValue: "non_verify",
    },
  });
}
