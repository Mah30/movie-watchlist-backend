import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Definição da interface para o payload do token
export interface TokenPayload {
  id: number;
  isAdmin: boolean;
}

// Extendendo a tipagem do Express para incluir `user`
declare module "express-serve-static-core" {
  interface Request {
    user?: TokenPayload;
  }
}

// Middleware de autenticação
export const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return void res.status(401).json({ message: "Token not provided or invalid" });
  }

  try {
    // Extraindo o token do cabeçalho
    const token = authHeader.split(" ")[1];

    // Verificando e decodificando o token
    const payload = jwt.verify(token, process.env.TOKEN_SECRET as string) as TokenPayload & JwtPayload;

    
    // Anexando os dados do usuário à requisição
    req.user = payload;

    next(); 
  } catch (error: any) {
    console.error("Authentication error:", error.message);

    if (error.name === "TokenExpiredError") {
      return void res.status(401).json({ message: "Token expired" });
    } else if (error.name === "JsonWebTokenError") {
      return void res.status(401).json({ message: "Invalid token" });
    }

    return void res.status(500).json({ message: "Internal server error during authentication" });
  }


};//  Middleware para verificar se o usuário é admin
export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user?.isAdmin) {
        res.status(403).json({ message: "Need admin permissions" });
        return;
    }
    next();
};

