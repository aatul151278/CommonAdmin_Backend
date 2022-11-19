import { NextFunction, Request, Response } from "express";
import { Op } from "sequelize";
import { tblusers } from "../../models/tblusers";
import Encorder from '../../providers/encoder';
import ErrorHandler from "../../middleware/error-handler";

const getUsers = async (req: Request, res: Response) => {
    try {
        const objRequestBody = req.body;
        const Page = (objRequestBody.page > 0 ? objRequestBody.page - 1 : 0 || 0);
        const Limit = objRequestBody.limit || 10;
        const Offset = Page * Limit;
        const Where = {};
        Where[Op.and] = [];
        const isActive = objRequestBody.isActive;
        const isDeleted = objRequestBody.isDeleted;
        
        if (objRequestBody.searchtext) {
            Where[Op.or] = [];
            Where[Op.or].push({ firstname: { [Op.like]: `%${objRequestBody.searchtext}%` } });
            Where[Op.or].push({ lastname: { [Op.like]: `%${objRequestBody.searchtext}%` } });
            Where[Op.or].push({ username: { [Op.like]: `%${objRequestBody.searchtext}%` } });
            Where[Op.or].push({ email: { [Op.like]: `%${objRequestBody.searchtext}%` } });
        }

        if (typeof (isActive) !== "undefined") {
            Where[Op.and].push({ isactive: { [Op.eq]: isActive } });
        }

        if (typeof (isDeleted) !== "undefined") {
            Where[Op.and].push({ isdeleted: { [Op.eq]: isDeleted } });
        }

        const resUsers = await tblusers.findAndCountAll({
            where: Where,
            offset: Offset,
            limit: Limit
        });

        return res.status(200).json({
            success: true,
            message: "User list",
            data: resUsers.rows,
            pagination: {
                totalRecord: resUsers.count,
                page: Page + 1,
                limit: Limit,
                totalPage: Math.ceil(resUsers.count / Limit)
            }
        });
    } catch (error) {
        ErrorHandler.throwError(error, req, res);
    }
};

const saveUser = async (req: Request, res: Response) => {
    try {
        const objUser = req.body;
        if (objUser == null || Object.keys(objUser).length == 0 || objUser?.email == null || objUser?.username == null || objUser.idrole <= 0) {
            return res.status(200).json({ success: false, message: `Please provide required field to save user`, data: null });
        }

        const hashPassword: string = await Encorder.EncryptString(objUser.password);

        const resUser = await tblusers.findOrCreate({
            where: {
                username: objUser.username,
                email: objUser.email,
            }, defaults: {
                firstname: objUser.firstname,
                lastname: objUser.lastname,
                username: objUser.username,
                email: objUser.email,
                password: hashPassword,
                idrole: objUser.idrole,
                isverified: 0,
                isactive: 1,
                isdeleted: 0,
                createdAt: new Date()
            }
        });

        const IsCreated: boolean = resUser[1];
        if (!IsCreated) return res.status(200).json({ success: false, message: `UserName or Email Already Exists`, data: resUser });

        return res.status(200).json({
            success: true, message: "User Created Successfully", data: resUser
        });
    } catch (error) { ErrorHandler.throwError(error, req, res); }
};

const updateUser = async (req: Request, res: Response) => {
    try {
        const objUser = req.body;
        if (objUser == null || Object.keys(objUser).length == 0 || !objUser?.id || objUser?.id?.length === 0) {
            return res.status(200).json({ success: false, message: `Please provide required field to update user`, data: null });
        }

        const objUserExist = await tblusers.findOne({ where: { id: objUser.id } })
        if (objUserExist) {
            if (objUser.firstname)
                objUserExist.firstname = objUser.firstname;
            if (objUser.lastname)
                objUserExist.lastname = objUser.lastname;
            if (objUser.username)
                objUserExist.username = objUser.username;
            if (objUser.email)
                objUserExist.email = objUser.email;
            if (objUser.idrole)
                objUserExist.idrole = objUser.idrole;
            if (objUser.isactive || objUser.isactive == 0)
                objUserExist.isactive = objUser.isactive;
            if (objUser.isverified || objUser.isverified == 0)
                objUserExist.isverified = objUser.isverified;

            objUserExist.updatedAt = new Date();
            await objUserExist.save();

            return res.status(200).json({
                success: true, message: "User Updated Successfully", data: objUserExist
            });
        }
        return res.status(200).json({
            success: false, message: "No User found with the given detail", data: null
        });
    } catch (error) { ErrorHandler.throwError(error, req, res); }
};

const deleteUser = async (req: Request, res: Response) => {
    try {
        const objUser = req.body;
        if (objUser === null || Object.keys(objUser)?.length === 0 || !objUser?.id || objUser?.id?.length === 0) {
            return ErrorHandler.throwError({ message: "please pass required field" }, req, res);
        }

        const resDeleteUser = await tblusers.update({
            isdeleted: 1,
            updatedAt: new Date()
        }, {
            where: {
                id: objUser.id
            }
        });
        let msg = "User Deleted Successfully";
        if (resDeleteUser[0] === 0) {
            msg = "Uset not found with this id";
            return res.status(200).json({
                success: false, message: msg
            });
        }
        return res.status(200).json({
            success: true, message: msg
        });
    } catch (error) { ErrorHandler.throwError(error, req, res); }
};

export default { getUsers, saveUser, updateUser, deleteUser };