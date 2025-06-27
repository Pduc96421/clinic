import { NextFunction, Response, Request } from "express";

export const denyRoles = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): any => {
    if (roles.includes(req.user.role)) {
      return res.status(403).json({
        code: 403,
        message: `User with role '${req.user.role}' is not allowed to access this resource.`,
      });
    }

    next();
  };
};
