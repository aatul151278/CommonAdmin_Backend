import express from 'express';
import AccountCtrl from '../controllers/account-ctrl';
const accountRouter = express.Router();

accountRouter.post('/account/login', AccountCtrl.login);
accountRouter.get('/account/verifyUser/:id', AccountCtrl.verifyUser);

export = accountRouter;