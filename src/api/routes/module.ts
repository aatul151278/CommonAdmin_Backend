import express from 'express';
import auth from '../../middleware/auth';
import ModuleCtrl from '../controllers/module-ctrl';
const moduleRouter = express.Router();

moduleRouter.post('/module/', auth.validateToken, ModuleCtrl.getAllModule);
moduleRouter.post('/module/create', auth.validateToken, ModuleCtrl.createModule);
moduleRouter.delete('/module/delete', auth.validateToken, ModuleCtrl.deleteModule);
moduleRouter.post('/module/permission', auth.validateToken, ModuleCtrl.getAllModulePermission);
moduleRouter.post('/module/permission/save', auth.validateToken, ModuleCtrl.saveModulePermission);

export = moduleRouter;