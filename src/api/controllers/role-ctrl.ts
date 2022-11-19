import { NextFunction, Request, Response } from "express";
import { Op } from "sequelize";
import { tblroles } from "../../models/tblroles";

const getRoles = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const objRequestBody = req.body;
        const Page = (objRequestBody.page > 0 ? objRequestBody.page - 1 : 0 || 0);
        const Limit = objRequestBody.limit || 10;
        const Offset = Page * Limit;
        const Where = {};

        if (objRequestBody.name) {
            Where[Op.and] = [];
            Where[Op.and].push({ name: { [Op.iLike]: `%${objRequestBody.name}%` } });
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
    } catch (error) { return next(error); }
};

const saveRole = async (req: Request, res: Response, next: NextFunction) => {
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
        if (!IsCreated) return res.status(200).json({ success: false, message: `${objRole.name} Role Already Exists`, data: resRole });

        return res.status(200).json({
            success: true, message: "Role Created Successfully", data: resRole
        });
    } catch (error) { return next(error); }
};

const updateRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const objRole = req.body;
        if (objRole == null || Object.keys(objRole).length == 0 || objRole?.id <= 0) {
            return res.status(200).json({ success: false, message: `Please provide required field to update role`, data: null });
        }

        const resUpdateUser = await tblroles.update({
            name: objRole.name,
            description: objRole.description,
            updatedAt: new Date()
        }, {
            where: {
                id: objRole.id
            }
        });

        return res.status(200).json({
            success: true, message: "Role Updated Successfully", data: resUpdateUser
        });
    } catch (error) { return next(error); }
};


const deleteRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const objRole = req.body;
        if (objRole == null) {
            return next();
        }

        const resDeleteRole = await tblroles.destroy({
            where: {
                id: objRole.id
            }
        });

        return res.status(200).json({
            success: true, message: "Role Deleted Successfully", data: resDeleteRole
        });
    } catch (error) { return next(error); }
};

export default { getRoles, saveRole, updateRole, deleteRole };