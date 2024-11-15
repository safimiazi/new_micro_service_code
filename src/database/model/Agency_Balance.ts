import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

export interface AgencyBalanceI
  extends Model<
    InferAttributes<AgencyBalanceI>,
    InferCreationAttributes<AgencyBalanceI>
  > {
  id: CreationOptional<string>;
  balance: string;
  rate: string;
  type: "prepaid" | "postpaid";
  agency_id?: ForeignKey<string>;
  createdAt?: Date;
  updatedAt?: Date;
}

export function AgencyBalanceModel(sequelize: Sequelize) {
  return sequelize.define<AgencyBalanceI>("agency_balance", {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    balance: {
      type: DataTypes.STRING,
      defaultValue: "0",
    },
    rate: {
      type: DataTypes.STRING,
      defaultValue: "0",
    },
    type: {
      allowNull: false,
      type: DataTypes.ENUM("prepaid", "postpaid"),
    },
  });
}
