import express, { Request, Response } from 'express';
import { ReturnValidationErrors } from '../middleware';
import { DB_CONFIG } from '../config';
import knex from 'knex';
const db = knex(DB_CONFIG);

export const formRouter = express.Router();

formRouter.get(
	'/',
	ReturnValidationErrors,
	async function (req: Request, res: Response) {
		try {
			let result = await db('Forms').select('*');
			res.status(200).json(result);
		} catch (error: any) {
			console.log(error.name, error.detail);
			res.status(500).json('Internal Server Error');
		}
	}
);

formRouter.get(
	'/:id',
	ReturnValidationErrors,
	async function (req: Request, res: Response) {
		try {
			let result = await db('Forms')
				.select('*')
				.where('id', '=', req.params.id);
			res.status(200).json(result);
		} catch (error: any) {
			console.log(error.name, error.detail);
			res.status(500).json('Internal Server Error');
		}
	}
);

formRouter.post(
	'/',
	ReturnValidationErrors,
	async function (req: Request, res: Response) {
		console.log(req.body);
		let authInsert = {
			taid: req.body.taid,
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			department: req.body.department,
			branch: req.body.branch,
			summary: req.body.summary,
			daysnottravel: req.body.daysnotTravel,
			travelduration: req.body.travelduartion,
			datebacktowork: req.body.datebacktowork,
			preappid: 1,
		};
		try {
			await db('auth').withSchema('travel').insert(authInsert);

			console.log('Insert successful', req.body);
			res.status(200).json('Insert successful');
		} catch (error: any) {
			console.log(error);
			res.status(500).json('Insert failed');
		}
	}
);

formRouter.delete(
	'/:id',
	ReturnValidationErrors,
	async function (req: Request, res: Response) {
		try {
			let result = await db('Forms').where('id', '=', req.params.id).del();
			if (result) {
				res.status(200).json('Delete successful');
				console.log('Delete successful', req.params.id);
			} else {
				res.status(500).json('Delete failed');
			}
		} catch (error: any) {
			res.status(500).json('Delete failed');
		}
	}
);

formRouter.put(
	'/:id',
	ReturnValidationErrors,
	async function (req: Request, res: Response) {
		try {
			await db('Forms').where('id', '=', req.params.id).update(req.body);
			console.log('Entry updated', req.body);
			res.status(200).json('Updated successful');
		} catch (error: any) {
			console.log(error.name, error.detail);
			res.status(500).json('Update failed');
		}
	}
);
