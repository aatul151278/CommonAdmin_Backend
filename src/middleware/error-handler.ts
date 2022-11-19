
import { NextFunction, Request, Response } from "express";

const throwError = async (err: any, req: Request, res: Response) => {
    res.status(err.statusCode || 500).send({ status: false, message: err.message })
};
export default { throwError };
