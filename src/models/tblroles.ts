import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { tblusers, tblusersId } from './tblusers';

export interface tblrolesAttributes {
  id: number;
  name?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type tblrolesPk = "id";
export type tblrolesId = tblroles[tblrolesPk];
export type tblrolesOptionalAttributes = "id" | "name" | "description" | "createdAt" | "updatedAt";
export type tblrolesCreationAttributes = Optional<tblrolesAttributes, tblrolesOptionalAttributes>;

export class tblroles extends Model<tblrolesAttributes, tblrolesCreationAttributes> implements tblrolesAttributes {
  id!: number;
  name?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;

  // tblroles hasMany tblusers via idrole
  tblusers!: tblusers[];
  getTblusers!: Sequelize.HasManyGetAssociationsMixin<tblusers>;
  setTblusers!: Sequelize.HasManySetAssociationsMixin<tblusers, tblusersId>;
  addTbluser!: Sequelize.HasManyAddAssociationMixin<tblusers, tblusersId>;
  addTblusers!: Sequelize.HasManyAddAssociationsMixin<tblusers, tblusersId>;
  createTbluser!: Sequelize.HasManyCreateAssociationMixin<tblusers>;
  removeTbluser!: Sequelize.HasManyRemoveAssociationMixin<tblusers, tblusersId>;
  removeTblusers!: Sequelize.HasManyRemoveAssociationsMixin<tblusers, tblusersId>;
  hasTbluser!: Sequelize.HasManyHasAssociationMixin<tblusers, tblusersId>;
  hasTblusers!: Sequelize.HasManyHasAssociationsMixin<tblusers, tblusersId>;
  countTblusers!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof tblroles {
    return tblroles.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(250),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tblroles',
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
    ]
  });
  }
}
