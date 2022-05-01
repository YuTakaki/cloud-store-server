import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export default async (req : Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.token;
    if (token) {
      const verify = jwt.verify(token.toString(), process.env.JWT_SECRET!) as {user_id : string};
      res.locals.user = verify.user_id;
      next();
    }
    
  } catch (error) {
    console.log(error);
    return res.status(401).send({error : "token not verify"})
  }

}