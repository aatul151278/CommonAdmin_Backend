import express from 'express';
import RoleCtrl from '../controllers/role-ctrl';
import auth from "../../middleware/auth";
const rolesRouter = express.Router();

rolesRouter.post('/role/', auth.validateToken, RoleCtrl.getRoles);
rolesRouter.post('/role/create', auth.validateToken, RoleCtrl.saveRole);
rolesRouter.post('/role/update', auth.validateToken, RoleCtrl.updateRole);
rolesRouter.post('/role/delete', auth.validateToken, RoleCtrl.deleteRole);

export = rolesRouter;