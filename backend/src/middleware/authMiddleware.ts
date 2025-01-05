import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || ''

declare global {

    namespace Express {

        interface Request {

            user?: {

                userId: string;

            };

        }

    }

}




function authMiddleware(req:Request,res:Response,next:NextFunction){
    const authHeader= req.headers['authorization'];
    const token = authHeader?.split(' ')[1] || '';

    if(!token){
       return res.status(401).json({message:'no token found'})
    }
    try {
        const decoded = jwt.verify(token , secret) ;
        
  if (typeof decoded === 'object' && 'userId' in decoded) {
    req.user = { userId: (decoded as JwtPayload).userId };
  } else {
    return res.status(400).json({ message: 'Invalid token structure' });
  }    
      next();
    } catch (error) {
       return res.status(401).json({message:' token not valid'})
    }
}

export default authMiddleware;