import express from 'express';
import UserCtrl from '../controllers/user-ctrl';
import auth from "../../middleware/auth";
const userRouter = express.Router();

userRouter.post('/user', auth.validateToken, UserCtrl.getUsers);
userRouter.post('/user/create', auth.validateToken, UserCtrl.saveUser);
userRouter.put('/user/update', auth.validateToken, UserCtrl.updateUser);
userRouter.delete('/user/delete', auth.validateToken, UserCtrl.deleteUser);

export = userRouter;