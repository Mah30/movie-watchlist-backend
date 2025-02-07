import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Definição da interface para o payload do token
interface TokenPayload {
  id: number;
  name: string;
  email: string;
  iat?: number;
  exp?: number;
}

// Extendendo a tipagem do Express para incluir `user`
declare module "express-serve-static-core" {
  interface Request {
    user?: TokenPayload;
  }
}

// Middleware de autenticação
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token not provided or invalid" });
  }

  try {
    // Extraindo o token do cabeçalho
    const token = authHeader.split(" ")[1];

    // Verificando e decodificando o token
    const payload = jwt.verify(token, process.env.TOKEN_SECRET as string) as TokenPayload;

    // Anexando os dados do usuário à requisição
    req.user = payload;

    next(); // Passa para a próxima rota
  } catch (error: any) {
    console.error("Authentication error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }

    return res.status(500).json({ message: "Internal server error during authentication" });
  }
};
