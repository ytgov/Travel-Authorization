import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { DB_HOST } from "../config";

export function RequiresAuthentication(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.status(401).send("You are not authorized to view this page");
}

export function ReturnValidationErrors(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  next();
}

export function RequiresRoleAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.user && req.user.roles.indexOf("Admin") == -1) {
    return res.status(401).send("You are not an Administrator");
  }

  next();
}

export async function doHealthCheck(req: Request, res: Response) {
  //let dbConnected = await data.isConnected();

  //if (!dbConnected)
  //    return res.status(500).send(`Not able to connect to <strong>MONGODB</strong> database on <strong>${MONGO_HOST}</strong>.`);

  res.send(`Connection to database on '<strong>${DB_HOST}</strong>' is connected and functioning.`);
}

export function RequiresAuth(req: Request, res: Response, next: NextFunction) {
  // if (req.isAuthenticated()) {
  return next();
  // }

  // res.redirect("/api/auth/login");
}

export function RequiresRolePatAdminOrAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.user && (req.user.roles.indexOf("Admin") >= 0 || req.user.roles.indexOf("PatAdmin") >= 0)) {
    return next();
  }
  return res.status(401).send("You are not an Administrator for Pre-Approval Travel Requests!");
}

export function RequiresRoleTdUser(req: Request, res: Response, next: NextFunction) {
  if (req.user && (req.user.roles.indexOf("TdUser") >= 0)) {
    return next();
  }
  return res.status(401).send("You are not a Travel Desk User!");
}

export function RequiresRoleTdUserOrAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.user && (req.user.roles.indexOf("Admin") >= 0 || req.user.roles.indexOf("TdUser") >= 0)) {
    return next();
  }
  return res.status(401).send("You are not an Administrator or Travel Desk User!");
}
