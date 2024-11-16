import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

export interface AgentBalanceI
  extends Model<
    InferAttributes<AgentBalanceI>,
    InferCreationAttributes<AgentBalanceI>
  > {
  id: CreationOptional<string>;
  balance: string;
  user_id?: ForeignKey<string>;
  agency_id?: ForeignKey<string>;
  createdAt?: Date;
  updatedAt?: Date;
}

export function AgentBalanceModel(sequelize: Sequelize) {
  return sequelize.define<AgentBalanceI>("agent_balance", {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    balance: {
      type: DataTypes.STRING,
      defaultValue: "0",
    },
  });
}
