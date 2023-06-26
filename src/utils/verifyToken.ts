import { Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const verifyAndDecodeToken = (token: string) => {
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  return decodedToken
}

const getToken = (req: Request) => {
  let token;
  const { authorization } = req.headers || {};
  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.split(' ')[1];
  }
  return token;
}

export { verifyAndDecodeToken, getToken }