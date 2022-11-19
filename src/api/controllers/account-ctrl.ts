import { NextFunction, Request, Response } from "express";
import { Op } from "sequelize";
import { tblusers } from "../../models/tblusers";
import ErrorHandler from "../../middleware/error-handler";
import BcryptProvider from '../../providers/bcrypt-encoder';
import JWTProvider from '../../providers/jwt-encoder';

const login = async (req: Request, res: Response) => {
    try {
        const objRequestBody = req.body;

        if (objRequestBody == null || Object.keys(objRequestBody).length == 0 || objRequestBody?.email?.length === 0) {
            return res.status(200).json({ success: false, message: `Please provide required field to login`, data: null });
        }

        const Where = {};
        Where[Op.or] = [];
        Where[Op.or].push({ username: { [Op.eq]: `${objRequestBody.email}` } });
        Where[Op.or].push({ email: { [Op.eq]: `${objRequestBody.email}` } });

        //#region  PassWord Verification
        const objUser = await tblusers.findOne({ where: Where, });
        if (!objUser) {
            return res.status(200).json({
                success: false, message: "Invalid Email/Username", data: null
            });
        }
        let hastext = objUser.password;
        const isValidPassword = await BcryptProvider.DecryptString(objRequestBody.password, hastext);
        if (!isValidPassword) {
            return res.status(200).json({
                success: false, message: "Invalid password", data: null
            });
        }
        //#endregion

        Where[Op.and] = [];
        Where[Op.and].push({ password: { [Op.eq]: hastext } });

        const resLogin = await tblusers.findOne({
            where: Where,
        });

        if (resLogin === null) {
            return res.status(200).json({
                success: false, message: "Invalid Email/Username or password", data: null
            });
        } else if (resLogin.isdeleted) {
            return res.status(200).json({
                success: false, message: "User Deleted, please contact site administrator", data: null
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
        const userObject = {
            id: resLogin.id,
            username: resLogin.username,
            email: resLogin.email,
            name: resLogin.firstname + " " + resLogin.lastname,
            lastloginAt: new Date()
        }
        return res.status(200).json({
            success: true, message: "Login Successfully", data: { token: JWTProvider.generateJWTToken(userObject), user: userObject }
        });
    } catch (error) { ErrorHandler.throwError(error, req, res); }
};

const verifyUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        if (!userId) return res.status(200).json({ success: false, message: `Please provide user id to verify account` });

        await tblusers.update({ isverified: 1 }, {
            where: { id: userId },
        });

        return res.status(200).json({
            success: true, message: "User Verified successfully.",
        });

    } catch (error) { ErrorHandler.throwError(error, req, res); }
}

const verifyToken = async (token: string): Promise<any> => {
    return new Promise(async (resolve) => {
        try {
            const objUser = JWTProvider.decodeJWTToken(token);
            if (objUser && objUser.id) {
                const isUserexist = await tblusers.count({ where: { id: objUser.id } });
                return resolve(isUserexist > 0);
            }
            return resolve(false);
        } catch (error) {
            return resolve(false);
        }
    });
}

export default { login, verifyUser, verifyToken };