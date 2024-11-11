import { hash } from "@utility/encryption";
import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
  literal,
} from "sequelize";

export interface UserI
  extends Model<InferAttributes<UserI>, InferCreationAttributes<UserI>> {
  id: CreationOptional<string>;
  name: CreationOptional<string>;
  email: string;
  phone: string;
  photo: string;
  designation: string;
  role: CreationOptional<string>;
  type: CreationOptional<"super" | "user">;
  password: string;
  status: "active" | "deactivate" | "non_verify" | "request";
  session: string;
  otp: string;
  agency_id?: ForeignKey<string>;
  createdAt?: Date;
  updatedAt?: Date;
}

export function UserModel(sequelize: Sequelize) {
  return sequelize.define<UserI>(
    "user",
    {
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
      photo: {
        allowNull: true,
        type: DataTypes.STRING(255),
      },
      designation: {
        allowNull: true,
        type: DataTypes.STRING(255),
      },
      name: {
        type: DataTypes.STRING,
      },
      type: {
        allowNull: false,
        type: DataTypes.ENUM("super", "user"),
      },
      status: {
        allowNull: false,
        type: DataTypes.ENUM("active", "deactivate", "non_verify", "request"),
      },

      session: {
        type: DataTypes.STRING,
      },
      otp: {
        type: DataTypes.STRING,
      },

      role: {
        type: DataTypes.JSON,
        get() {
          const json = this.getDataValue("role");
          if (json) {
            return JSON.parse(json);
          }
          return null;
        },
        set(value) {
          if (!value) {
            value = [];
          }
          this.setDataValue("role", JSON.stringify(value));
        },
      },

      password: {
        allowNull: false,
        type: DataTypes.STRING(255),
        set(value: string) {
          this.setDataValue("password", hash(value));
        },
      },
    },
    {
      defaultScope: {
        attributes: {
          include: [[literal("JSON_UNQUOTE(role)"), "role"]],
          exclude: ["password", "session", "otp"],
        },
      },
    }
  );
}
