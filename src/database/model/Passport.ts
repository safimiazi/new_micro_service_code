import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

export interface PassportI
  extends Model<
    InferAttributes<PassportI>,
    InferCreationAttributes<PassportI>
  > {
  id: CreationOptional<string>;
  name: string;
  father_name: string;
  mother_name: string;
  permanent_address: string;
  phone: string;
  sure_name: string;
  given_name: string;
  nationality: string;
  previous_passport_n: string;
  date_of_barth: Date;
  birth_place: string;
  passport_issue_date: Date;
  passport_expire_date: Date;
  passport_number: string;
  agency_id?: ForeignKey<string>;
  createdAt?: Date;
  updatedAt?: Date;
}

export function PassportModel(sequelize: Sequelize) {
  return sequelize.define<PassportI>("passport", {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    father_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mother_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    permanent_address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sure_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    given_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nationality: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    previous_passport_n: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    date_of_barth: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    birth_place: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    passport_issue_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    passport_expire_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    passport_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
}
