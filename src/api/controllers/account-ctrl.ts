import { NextFunction, Request, Response } from "express";
import { Op } from "sequelize";
import { tblusers } from "../../models/tblusers";
import Encorder from '../../providers/encoder';

const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const objRequestBody = req.body;

        if (objRequestBody == null || Object.keys(objRequestBody).length == 0 || objRequestBody?.email?.length === 0) {
            return res.status(200).json({ success: false, message: `Please provide required field to login`, data: null });
        }

        const Where = {};
        Where[Op.or] = [];
        Where[Op.or].push({ username: { [Op.iLike]: `%${objRequestBody.email}%` } });
        Where[Op.or].push({ email: { [Op.iLike]: `%${objRequestBody.email}%` } });

        Where[Op.and] = [];
        Where[Op.and].push({ password: { [Op.eq]: Encorder.EncryptString(objRequestBody.password) } });

        const resLogin = await tblusers.findOne({
            where: Where,
        });

        if (resLogin === null) {
            return res.status(200).json({
                success: false, message: "Invalid Email/Username or password", data: null
            });
        } else if (resLogin.isdeleted) {
            return res.status(200).json({
                success: false, message: "User Not FOUND, please contact site administrator", data: null
            });
        } else if (!resLogin.isverified) {
            return res.status(200).json({
                success: false, message: "User Not Verified, please check email to verify account", data: null
            });
        } else if (!resLogin.isactive) {
            return res.status(200).json({
                success: false, message: "User Not ACTIVE, please contact site administrator", data: null
            });
        }

        await resLogin.update({ lastloginAt: new Date() });
        return res.status(200).json({
            success: true, message: "Role list", data: { token: "", resLogin }
        });
    } catch (error) { return next(error); }
};


export default { login };