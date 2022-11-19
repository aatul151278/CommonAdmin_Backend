import type { Sequelize } from "sequelize";
import { tblmodule as _tblmodule } from "./tblmodule";
import type { tblmoduleAttributes, tblmoduleCreationAttributes } from "./tblmodule";
import { tblmodule_permission as _tblmodule_permission } from "./tblmodule_permission";
import type { tblmodule_permissionAttributes, tblmodule_permissionCreationAttributes } from "./tblmodule_permission";
import { tblroles as _tblroles } from "./tblroles";
import type { tblrolesAttributes, tblrolesCreationAttributes } from "./tblroles";
import { tblusers as _tblusers } from "./tblusers";
import type { tblusersAttributes, tblusersCreationAttributes } from "./tblusers";

export {
  _tblmodule as tblmodule,
  _tblmodule_permission as tblmodule_permission,
  _tblroles as tblroles,
  _tblusers as tblusers,
};

export type {
  tblmoduleAttributes,
  tblmoduleCreationAttributes,
  tblmodule_permissionAttributes,
  tblmodule_permissionCreationAttributes,
  tblrolesAttributes,
  tblrolesCreationAttributes,
  tblusersAttributes,
  tblusersCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const tblmodule = _tblmodule.initModel(sequelize);
  const tblmodule_permission = _tblmodule_permission.initModel(sequelize);
  const tblroles = _tblroles.initModel(sequelize);
  const tblusers = _tblusers.initModel(sequelize);

  tblmodule_permission.belongsTo(tblmodule, { as: "idmodule_tblmodule", foreignKey: "idmodule"});
  tblmodule.hasMany(tblmodule_permission, { as: "tblmodule_permissions", foreignKey: "idmodule"});
  tblmodule_permission.belongsTo(tblroles, { as: "idrole_tblrole", foreignKey: "idrole"});
  tblroles.hasMany(tblmodule_permission, { as: "tblmodule_permissions", foreignKey: "idrole"});
  tblusers.belongsTo(tblroles, { as: "idrole_tblrole", foreignKey: "idrole"});
  tblroles.hasMany(tblusers, { as: "tblusers", foreignKey: "idrole"});

  return {
    tblmodule: tblmodule,
    tblmodule_permission: tblmodule_permission,
    tblroles: tblroles,
    tblusers: tblusers,
  };
}
