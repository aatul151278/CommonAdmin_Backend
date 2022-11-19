import { NextFunction, Request, Response } from "express";
const Authorized_Request = process.env.Authorized_Request;
const validateToken = async (req: Request, res: Response, next: NextFunction) => {
    if (req["token"] || Authorized_Request === "0") {
        return next();
    }
    res.status(403).json({
        message: "Not Authorized Request"
    });
};


export default { validateToken};