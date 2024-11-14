import { ENV } from "@config/env";

import { Sequelize } from "sequelize";
import { log } from "console";
import { AdministrationI, AdministrationModel } from "./model/administration";
import { AgencyI, AgencyModel } from "./model/Agency";
import { UserI, UserModel } from "./model/user";
import { LoiAgencyModel } from "./model/LOI_Agency";
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


export const db = {
  sequelize,
  Administration,
  Agency,
  User,
  LoiAgency,
} as const;
