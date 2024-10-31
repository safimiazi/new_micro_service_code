import { ENV } from "@config/env";

import { Sequelize, HasMany, Transaction } from "sequelize";
import { log } from "console";
import { AdministrationI, AdministrationModel } from "./model/administration";
import { AgencyI, AgencyModel } from "./model/Agency";
import { UserI, UserModel } from "./model/user";
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

User.hasMany<UserI, AgencyI>(Agency, {
  foreignKey: "agency_id",
  onDelete: "SET NULL",
  as: "agency",
});

Agency.belongsTo<AgencyI, UserI>(User, {
  foreignKey: "agency_id",
  onDelete: "SET NULL",
  as: "user",
});

export const db = {
  sequelize,
  Administration,
  Agency,
  User,
} as const;
