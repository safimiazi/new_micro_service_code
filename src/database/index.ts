import { ENV } from "@config/env";

import { Sequelize } from "sequelize";
import { log } from "console";
import { AdministrationI, AdministrationModel } from "./model/administration";
import { AgencyI, AgencyModel } from "./model/Agency";
import { UserI, UserModel } from "./model/user";
import { LoiAgencyModel } from "./model/LOI_Agency";
import { AgencyBalanceModel } from "./model/Agency_Balance";
import { AgentBalanceModel } from "./model/Agent_Balance";
const LogQuery = false;

const sequelize = new Sequelize({
  dialect: "mysql",
  host: ENV.DATABASE_HOST,
  port: ENV.DATABASE_PORT,
  database: ENV.DATABASE_NAME,
  password: ENV.DATABASE_PASSWORD,
  username: ENV.DATABASE_USER,
  timezone: "+06:00",
  define: {
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    underscored: true,
  },
  pool: {
    min: 0,
    max: 5,
  },
  logQueryParameters: ENV.NODE_ENV === "development",
  logging:
    ENV.NODE_ENV === "development" && LogQuery
      ? (query, time) => {
          log("\n ☢ " + time + "ms:" + " " + query);
        }
      : false,
  benchmark: LogQuery,
});

sequelize.authenticate();
const Administration = AdministrationModel(sequelize);
const Agency = AgencyModel(sequelize);
const User = UserModel(sequelize);
const LoiAgency = LoiAgencyModel(sequelize);
const AgencyBalance = AgencyBalanceModel(sequelize);
const AgentBalance = AgentBalanceModel(sequelize);

Agency.hasMany<AgencyI, AdministrationI>(Administration, {
  foreignKey: "ref_admin_id",
  onDelete: "SET NULL",
  as: "ref_admin",
});

Administration.belongsTo<AdministrationI, AgencyI>(Agency, {
  foreignKey: "ref_admin_id",
  onDelete: "SET NULL",
  as: "agency",
});

Agency.hasMany<AgencyI, UserI>(User, {
  foreignKey: "agency_id",
  onDelete: "SET NULL",
  as: "user",
});

User.belongsTo<UserI, AgencyI>(Agency, {
  foreignKey: "agency_id",
  onDelete: "SET NULL",
  as: "agency",
});

// agency - balance
Agency.hasOne(AgencyBalance, {
  foreignKey: "agency_id",
  onDelete: "CASCADE",
});
AgencyBalance.belongsTo(Agency, {
  foreignKey: "agency_id",
  onDelete: "SET NULL",
});
// agent - balance - agency
Agency.hasMany(AgentBalance, {
  foreignKey: "agency_id",
  onDelete: "CASCADE",
});
AgentBalance.belongsTo(Agency, {
  foreignKey: "agency_id",
  onDelete: "SET NULL",
});
User.hasOne(AgentBalance, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});
AgentBalance.belongsTo(User, {
  foreignKey: "user_id",
  onDelete: "SET NULL",
});

export const db = {
  sequelize,
  Administration,
  Agency,
  User,
  LoiAgency,
  AgentBalance,
  AgencyBalance,
} as const;
