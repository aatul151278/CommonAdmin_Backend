import { NextFunction, Request, Response } from "express";
import AccountCtrl from './../api/controllers/account-ctrl';

const Authorized_Request = process.env.Authorized_Request;
const validateToken = async (req: Request, res: Response, next: NextFunction) => {
    //By pass Authentication
    if (Authorized_Request === "0") {
        return next();
    }

    //validate token
    if (req.headers.authorization) {
        const TokenVerified = await AccountCtrl.verifyToken(req.headers.authorization);
        if (TokenVerified) return next();
    }

    //return 
    res.status(403).json({
        message: "Not Authorized Request"
    });
};

export default { validateToken };