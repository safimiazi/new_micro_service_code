import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

export interface AgencyI
  extends Model<InferAttributes<AgencyI>, InferCreationAttributes<AgencyI>> {
  id: CreationOptional<string>;
  name: CreationOptional<string>;
  email: string;
  phone: string;
  logo: string;
  address: string;
  status: "active" | "deactivated" | "block" | "non_verify";
  ref_admin_id?: ForeignKey<string>;
  createdAt?: Date;
  updatedAt?: Date;
}

export function AgencyModel(sequelize: Sequelize) {
  return sequelize.define<AgencyI>("agency", {
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
      allowNull: true,
      type: DataTypes.STRING(255),
    },
    address: {
      allowNull: true,
      type: DataTypes.STRING(255),
    },

    name: {
      type: DataTypes.STRING,
    },
    status: {
      allowNull: false,
      type: DataTypes.ENUM("active", "deactivated", "block", "non_verify"),
      defaultValue: "non_verify",
    },
  });
}
