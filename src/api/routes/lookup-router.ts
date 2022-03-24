import express, { Request, Response } from 'express';
import { ReturnValidationErrors } from '../middleware';
import { DB_CONFIG } from '../config';
import knex from 'knex';
const db = knex(DB_CONFIG);

export const lookupRouter = express.Router();

lookupRouter.get(
	'/destination',
	ReturnValidationErrors,
	async function (req: Request, res: Response) {
		try {
			let result = await db('destination')
				.withSchema('travel')
				.select('province', 'city');
			res.status(200).json(result);
		} catch (error: any) {
			console.log(error);
			res.status(500).json('Internal Server Error');
		}
	}
);
