import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { tblmodule, tblmoduleId } from './tblmodule';
import type { tblroles, tblrolesId } from './tblroles';

export interface tblmodule_permissionAttributes {
  id: string;
  idmodule?: string;
  idrole?: number;
  view?: number;
  edit?: number;
  delete?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type tblmodule_permissionPk = "id";
export type tblmodule_permissionId = tblmodule_permission[tblmodule_permissionPk];
export type tblmodule_permissionOptionalAttributes = "idmodule" | "idrole" | "view" | "edit" | "delete" | "createdAt" | "updatedAt";
export type tblmodule_permissionCreationAttributes = Optional<tblmodule_permissionAttributes, tblmodule_permissionOptionalAttributes>;

export class tblmodule_permission extends Model<tblmodule_permissionAttributes, tblmodule_permissionCreationAttributes> implements tblmodule_permissionAttributes {
  id!: string;
  idmodule?: string;
  idrole?: number;
  view?: number;
  edit?: number;
  delete?: number;
  createdAt?: Date;
  updatedAt?: Date;

  // tblmodule_permission belongsTo tblmodule via idmodule
  idmodule_tblmodule!: tblmodule;
  getIdmodule_tblmodule!: Sequelize.BelongsToGetAssociationMixin<tblmodule>;
  setIdmodule_tblmodule!: Sequelize.BelongsToSetAssociationMixin<tblmodule, tblmoduleId>;
  createIdmodule_tblmodule!: Sequelize.BelongsToCreateAssociationMixin<tblmodule>;
  // tblmodule_permission belongsTo tblroles via idrole
  idrole_tblrole!: tblroles;
  getIdrole_tblrole!: Sequelize.BelongsToGetAssociationMixin<tblroles>;
  setIdrole_tblrole!: Sequelize.BelongsToSetAssociationMixin<tblroles, tblrolesId>;
  createIdrole_tblrole!: Sequelize.BelongsToCreateAssociationMixin<tblroles>;

  static initModel(sequelize: Sequelize.Sequelize): typeof tblmodule_permission {
    return tblmodule_permission.init({
    id: {
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    idmodule: {
      type: DataTypes.STRING(45),
      allowNull: true,
      references: {
        model: 'tblmodule',
        key: 'id'
      }
    },
    idrole: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tblroles',
        key: 'id'
      }
    },
    view: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    edit: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    delete: {
      type: DataTypes.TINYINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tblmodule_permission',
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
        name: "fk_module_idx",
        using: "BTREE",
        fields: [
          { name: "idmodule" },
        ]
      },
      {
        name: "fk_roles_idx",
        using: "BTREE",
        fields: [
          { name: "idrole" },
        ]
      },
    ]
  });
  }
}
