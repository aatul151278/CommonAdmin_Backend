import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { tblroles, tblrolesId } from './tblroles';

export interface tblusersAttributes {
  id: string;
  firstname?: string;
  lastname?: string;
  username?: string;
  email?: string;
  idrole?: number;
  password?: string;
  isverified?: number;
  isactive?: number;
  isdeleted?: number;
  createdAt?: Date;
  updatedAt?: Date;
  lastloginAt?: Date;
}

export type tblusersPk = "id";
export type tblusersId = tblusers[tblusersPk];
export type tblusersOptionalAttributes = "firstname" | "lastname" | "username" | "email" | "idrole" | "password" | "isverified" | "isactive" | "isdeleted" | "createdAt" | "updatedAt" | "lastloginAt";
export type tblusersCreationAttributes = Optional<tblusersAttributes, tblusersOptionalAttributes>;

export class tblusers extends Model<tblusersAttributes, tblusersCreationAttributes> implements tblusersAttributes {
  id!: string;
  firstname?: string;
  lastname?: string;
  username?: string;
  email?: string;
  idrole?: number;
  password?: string;
  isverified?: number;
  isactive?: number;
  isdeleted?: number;
  createdAt?: Date;
  updatedAt?: Date;
  lastloginAt?: Date;

  // tblusers belongsTo tblroles via idrole
  idrole_tblrole!: tblroles;
  getIdrole_tblrole!: Sequelize.BelongsToGetAssociationMixin<tblroles>;
  setIdrole_tblrole!: Sequelize.BelongsToSetAssociationMixin<tblroles, tblrolesId>;
  createIdrole_tblrole!: Sequelize.BelongsToCreateAssociationMixin<tblroles>;

  static initModel(sequelize: Sequelize.Sequelize): typeof tblusers {
    return tblusers.init({
    id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    firstname: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    lastname: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    idrole: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tblroles',
        key: 'id'
      }
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isverified: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0
    },
    isactive: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    isdeleted: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    lastloginAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tblusers',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "fk_role_idx",
        using: "BTREE",
        fields: [
          { name: "idrole" },
        ]
      },
    ]
  });
  }
}
