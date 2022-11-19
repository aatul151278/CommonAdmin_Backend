import { NextFunction, Request, Response } from "express";
import { Op } from "sequelize";
import { tblroles } from "../../models/tblroles";
import ErrorHandler from "../../middleware/error-handler";
import { tblusers } from "../../models/tblusers";

const getRoles = async (req: Request, res: Response) => {
    try {
        const objRequestBody = req.body;
        const Page = (objRequestBody.page > 0 ? objRequestBody.page - 1 : 0 || 0);
        const Limit = objRequestBody.limit || 10;
        const Offset = Page * Limit;
        const Where = {};

        if (objRequestBody.name) {
            Where[Op.and] = [];
            Where[Op.and].push({ name: { [Op.like]: `%${objRequestBody.name}%` } });
        }

        const resRoles = await tblroles.findAndCountAll({
            where: Where,
            offset: Offset,
            limit: Limit
        });

        return res.status(200).json({
            success: true, message: "Role list", data: resRoles.rows, pagination: {
                totalRecord: resRoles.count,
                page: Page + 1,
                limit: Limit,
                totalPage: Math.ceil(resRoles.count / Limit)
            }
        });
    } catch (error) { ErrorHandler.throwError(error, req, res); }
};

const saveRole = async (req: Request, res: Response) => {
    try {
        const objRole = req.body;
        if (objRole == null || Object.keys(objRole).length == 0) {
            return res.status(200).json({ success: false, message: `Please provide required field to save role`, data: null });
        }

        const resRole = await tblroles.findOrCreate({
            where: {
                name: objRole.name
            }, defaults: {
                name: objRole.name,
                description: objRole.description,
                createdAt: new Date()
            }
        });

        const IsCreated: boolean = resRole[1];
        if (!IsCreated) return res.status(200).json({ success: false, message: `'${objRole.name}' Role Already Exists`, data: resRole[0] });

        return res.status(200).json({
            success: true, message: "Role Created Successfully", data: resRole[0]
        });
    } catch (error) { ErrorHandler.throwError(error, req, res); }
};

const updateRole = async (req: Request, res: Response) => {
    try {
        const objRole = req.body;
        if (objRole == null || Object.keys(objRole).length == 0 || !objRole?.id || objRole?.id <= 0) {
            return res.status(200).json({ success: false, message: `Please provide required field to update role`, data: null });
        }

        const objRoleExist = await tblroles.findOne({ where: { id: objRole.id } })
        if (objRoleExist) {
            if (typeof (objRole.name) != "undefined")
                objRoleExist.name = objRole.name;
            if (typeof (objRole.description) != "undefined")
                objRoleExist.description = objRole.description;
            objRoleExist.updatedAt = new Date();

            await objRoleExist.save();
            return res.status(200).json({
                success: true, message: "Role Updated Successfully", data: objRoleExist
            });
        }
        return res.status(200).json({
            success: false, message: "No Role found with the given detail", data: null
        });
    } catch (error) { ErrorHandler.throwError(error, req, res); }
};


const deleteRole = async (req: Request, res: Response) => {
    try {
        const objRole = req.body;
        if (objRole == null || !objRole?.id) {
            return ErrorHandler.throwError({ message: "please pass required field" }, req, res);
        }

        const isExistUserinRole = await tblusers.count({ where: { idrole: objRole.id } });
        if (isExistUserinRole > 0) {
            return res.status(200).json({ success: false, message: `You can not delete this role, user exists in this role` });
        }
        const resDeleteRole = await tblroles.destroy({
            where: {
                id: objRole.id
            }
        });
        let msg = "Role Deleted Successfully";
        if (resDeleteRole === 0) {
            msg = "Role not found with this id";
            return res.status(200).json({
                success: false, message: msg
            });
        }
        return res.status(200).json({
            success: true, message: msg
        });
    } catch (error) { ErrorHandler.throwError(error, req, res); }
};

export default { getRoles, saveRole, updateRole, deleteRole };