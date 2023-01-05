import { NextFunction, Request, Response } from "express";
import jwt from "express-jwt";
import axios from "axios";
import jwksRsa from "jwks-rsa";
import { AUTH0_DOMAIN, AUTH0_AUDIENCE } from "../config";
import { UserService } from "../services";

export const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${AUTH0_DOMAIN}.well-known/jwks.json`,
  }),

  // Validate the audience and the issuer.
  audience: AUTH0_AUDIENCE,
  issuer: [AUTH0_DOMAIN],
  algorithms: ["RS256"],
});

export async function loadUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const db = req.store.Users as UserService;

  let email = req.user.email;
  const token = req.headers.authorization || "";
  let u = await db.getByEmail(email);

  if (u) {
    req.user = { ...req.user, ...u };
    return next();
  }

  console.log("User not found in DB:", email, "Looking up userinfo from Auth0");

  await axios
    .get(`${AUTH0_DOMAIN}userinfo`, { headers: { authorization: token } })
    .then(async (resp) => {
      if (resp.data && resp.data.sub) {
        let email = resp.data.email;
        let first_name = resp.data.given_name;
        let last_name = resp.data.family_name;
        email = resp.data.email;

        let u = await db.getByEmail(email);

        if (u) {
          req.user = { ...req.user, ...u };
        } else {
          if (!email) email = `${first_name}.${last_name}@yukon-no-email.ca`;

          let eu = await db.getByEmail(email);

          if (eu) {
            eu.sub = email;
            // await db.update(eu._id || new ObjectId(), eu);

            // console.log("UPDATE USER SUB " + email, sub, u);
            req.user = { ...req.user, ...eu };
          } else {
            u = await db.create(
              email,
              first_name,
              last_name,
              '["Employee"]',
              "Active"
            );
            console.log("CREATING USER FOR " + email, u);
            req.user = { ...req.user, ...u };
          }
        }
      } else {
        console.log("Payload from Auth0 is strange or failed for", req.user);
      }

      next();
    })
    .catch((err) => {
      console.log("ERROR pulling userinfo from Auth0", err);
    });
}
