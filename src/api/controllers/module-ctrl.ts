import { Request, Response } from "express";
import { Op } from "sequelize";
import ErrorHandler from "../../middleware/error-handler";
import { tblmodule } from "../../models/tblmodule";
import { tblmodule_permission } from "../../models/tblmodule_permission";

const getAllModule = async (req: Request, res: Response) => {
    try {
        var where = {};
        where[Op.and] = [];
        const objBody = req.body;
        if (typeof (objBody?.active) != "undefined") {
            where[Op.and].push({ active: objBody.active })
        }
        const resAllModules = await tblmodule.findAll({ where: where });
        return res.status(200).json({ success: true, data: resAllModules });
    } catch (error) { ErrorHandler.throwError(error, req, res); }
}

const createModule = async (req: Request, res: Response) => {
    try {
        const objModule = req.body;
        if (objModule == null || Object.keys(objModule).length == 0 || !objModule.name) {
            return res.status(200).json({ success: false, message: `Please provide required field to save role` });
        }

        const resModule = await tblmodule.findOrCreate({
            where: {
                name: objModule.name
            }, defaults: {
                name: objModule.name,
                parent_id: objModule.parent_id,
                active: 1
            }
        });

        const IsCreated: boolean = resModule[1];
        if (!IsCreated) return res.status(200).json({ success: false, message: `'${objModule.name}' Module Already Exists`, data: resModule[0] });

        return res.status(200).json({
            success: true, message: "Module Created Successfully", data: resModule[0]
        });
    } catch (error) { ErrorHandler.throwError(error, req, res); }
}

const deleteModule = async (req: Request, res: Response) => {
    try {
        const objModule = req.body;
        if (objModule == null || !objModule?.id) {
            return ErrorHandler.throwError({ message: "please pass required field" }, req, res);
        }

        const isExistModulePermission = await tblmodule_permission.count({ where: { idmodule: objModule.id } });
        if (isExistModulePermission > 0) {
            return res.status(200).json({ success: false, message: `You can not delete this module, module exists in role permission` });
        }
        const resDeleteRole = await tblmodule.destroy({
            where: {
                id: objModule.id
            }
        });
        let msg = "Module Deleted Successfully";
        if (resDeleteRole === 0) {
            msg = "Module not found with this id";
            return res.status(200).json({ success: false, message: msg });
        }
        return res.status(200).json({
            success: true, message: msg
        });
    } catch (error) { ErrorHandler.throwError(error, req, res); }
};

const getAllModulePermission = async (req: Request, res: Response) => {
    try {
        const objRequestBody = req.body;
        const Page = (objRequestBody.page > 0 ? objRequestBody.page - 1 : 0 || 0);
        const Limit = objRequestBody.limit || 10;
        const Offset = Page * Limit;

        var Where = {};
        Where[Op.and] = [];
        if (objRequestBody.name) {
            Where[Op.and].push({ "$idmodule_tblmodule.name$": { [Op.like]: `%${objRequestBody.name}%` } });
        }

        if (objRequestBody.idrole) {
            Where[Op.and].push({ idrole: { [Op.eq]: objRequestBody.idrole } });
        }

        const resAllModulePermission = await tblmodule_permission.findAndCountAll({
            where: Where,
            include: [{ model: tblmodule, as: "idmodule_tblmodule" }],
            offset: Offset,
            limit: Limit
        });

        return res.status(200).json({
            success: true, message: "Module Permission list",
            data: resAllModulePermission.rows,
            pagination: {
                totalRecord: resAllModulePermission.count,
                page: Page + 1,
                limit: Limit,
                totalPage: Math.ceil(resAllModulePermission.count / Limit)
            }
        });
    } catch (error) {
        ErrorHandler.throwError(error, req, res);
    }
}

const saveModulePermission = async (req: Request, res: Response) => {
    try {
        const objModulePermission = req.body;
        if (objModulePermission == null || Object.keys(objModulePermission).length == 0 || !objModulePermission.idmodule || !objModulePermission.idrole) {
            return res.status(200).json({ success: false, message: `Please provide required field to save role` });
        }

        const objExistPermission = await tblmodule_permission.findOne({
            where: {
                idmodule: objModulePermission.idmodule,
                idrole: objModulePermission.idrole
            }
        }).catch((er) => { throw er });
        if (objExistPermission) {
            objExistPermission.view = objModulePermission.view;
            objExistPermission.edit = objModulePermission.edit;
            objExistPermission.delete = objModulePermission.delete;
            objExistPermission.updatedAt = new Date();
            await objExistPermission.save()
        } else {
            await tblmodule_permission.create({
                idmodule: objModulePermission.idmodule,
                idrole: objModulePermission.idrole,
                view: objModulePermission.view,
                edit: objModulePermission.edit,
                delete: objModulePermission.delete,
                updatedAt: new Date()
            }).catch((er) => { throw er });
        }
        return res.status(200).json({
            success: true, message: "Permission Save",
        });
    } catch (error) { ErrorHandler.throwError(error, req, res); }
}
export default { getAllModule, createModule, deleteModule, getAllModulePermission, saveModulePermission };
