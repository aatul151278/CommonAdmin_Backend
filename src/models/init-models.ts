import type { Sequelize } from "sequelize";
import { tblroles as _tblroles } from "./tblroles";
import type { tblrolesAttributes, tblrolesCreationAttributes } from "./tblroles";
import { tblusers as _tblusers } from "./tblusers";
import type { tblusersAttributes, tblusersCreationAttributes } from "./tblusers";

export {
  _tblroles as tblroles,
  _tblusers as tblusers,
};

export type {
  tblrolesAttributes,
  tblrolesCreationAttributes,
  tblusersAttributes,
  tblusersCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const tblroles = _tblroles.initModel(sequelize);
  const tblusers = _tblusers.initModel(sequelize);

  tblusers.belongsTo(tblroles, { as: "idrole_tblrole", foreignKey: "idrole"});
  tblroles.hasMany(tblusers, { as: "tblusers", foreignKey: "idrole"});

  return {
    tblroles: tblroles,
    tblusers: tblusers,
  };
}
