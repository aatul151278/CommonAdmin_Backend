import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { tblmodule_permission, tblmodule_permissionId } from './tblmodule_permission';

export interface tblmoduleAttributes {
  id: string;
  name?: string;
  parent_id?: string;
  active?: number;
}

export type tblmodulePk = "id";
export type tblmoduleId = tblmodule[tblmodulePk];
export type tblmoduleOptionalAttributes = "name" | "parent_id" | "active";
export type tblmoduleCreationAttributes = Optional<tblmoduleAttributes, tblmoduleOptionalAttributes>;

export class tblmodule extends Model<tblmoduleAttributes, tblmoduleCreationAttributes> implements tblmoduleAttributes {
  id!: string;
  name?: string;
  parent_id?: string;
  active?: number;

  // tblmodule hasMany tblmodule_permission via idmodule
  tblmodule_permissions!: tblmodule_permission[];
  getTblmodule_permissions!: Sequelize.HasManyGetAssociationsMixin<tblmodule_permission>;
  setTblmodule_permissions!: Sequelize.HasManySetAssociationsMixin<tblmodule_permission, tblmodule_permissionId>;
  addTblmodule_permission!: Sequelize.HasManyAddAssociationMixin<tblmodule_permission, tblmodule_permissionId>;
  addTblmodule_permissions!: Sequelize.HasManyAddAssociationsMixin<tblmodule_permission, tblmodule_permissionId>;
  createTblmodule_permission!: Sequelize.HasManyCreateAssociationMixin<tblmodule_permission>;
  removeTblmodule_permission!: Sequelize.HasManyRemoveAssociationMixin<tblmodule_permission, tblmodule_permissionId>;
  removeTblmodule_permissions!: Sequelize.HasManyRemoveAssociationsMixin<tblmodule_permission, tblmodule_permissionId>;
  hasTblmodule_permission!: Sequelize.HasManyHasAssociationMixin<tblmodule_permission, tblmodule_permissionId>;
  hasTblmodule_permissions!: Sequelize.HasManyHasAssociationsMixin<tblmodule_permission, tblmodule_permissionId>;
  countTblmodule_permissions!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof tblmodule {
    return tblmodule.init({
    id: {
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    parent_id: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    active: {
      type: DataTypes.TINYINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tblmodule',
    timestamps: false,
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
