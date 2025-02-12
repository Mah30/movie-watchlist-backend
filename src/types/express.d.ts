import { TokenPayload } from "../middlewares/route-guard.middleware";

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}