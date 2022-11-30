import express, { Request, Response } from 'express';
import { ReturnValidationErrors } from '../middleware';
import { DB_CONFIG } from '../config';
import knex from 'knex';
import { UserService } from '../services';

const db = knex(DB_CONFIG);

export const preapprovedRouter = express.Router();
const userService = new UserService();

preapprovedRouter.get(
	'/',
	ReturnValidationErrors,
	async function (req: Request, res: Response) {}
);
