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
				.select('destinationid as id', 'province', 'city');
			res.status(200).json(result);
		} catch (error: any) {
			console.log(error);
			res.status(500).json('Internal Server Error');
		}
	}
);

lookupRouter.get(
	'/departments',
	ReturnValidationErrors,
	async function (req: Request, res: Response) {
		try {
			let result = await db('departments')
				.withSchema('travel')
				.select('id', 'name', 'type', 'ownedby')
				.where('type', '=', 'department');
			res.status(200).json(result);
		} catch (error: any) {
			console.log(error);
			res.status(500).json('Internal Server Error');
		}
	}
);

lookupRouter.get(
	'/branches',
	ReturnValidationErrors,
	async function (req: Request, res: Response) {
		try {
			let result = await db('departments')
				.withSchema('travel')
				.select(
					'departments.id',
					'departments.name',
					'departments.type',
					'departments.ownedby',
					'b.name as department'
				)
				.where('departments.type', '=', 'branch')
				.innerJoin('departments as b', 'departments.ownedby', 'b.id');
			result.map((element) => {
				element.fullName = `${element.department} - ${element.name}`;
			});
			res.status(200).json(result);
		} catch (error: any) {
			console.log(error);
			res.status(500).json('Internal Server Error');
		}
	}
);

lookupRouter.get(
	'/department/:id',
	ReturnValidationErrors,
	async function (req: Request, res: Response) {
		try {
			let result = await db('departments')
				.withSchema('travel')
				.select('id', 'name', 'type', 'ownedby')
				.where('ownedby', '=', req.params.id)
				.andWhere('type', '=', 'branch');
			res.status(200).json(result);
		} catch (error: any) {
			console.log(error);
			res.status(500).json('Internal Server Error');
		}
	}
);

lookupRouter.get(
	'/roles',
	ReturnValidationErrors,
	async function (req: Request, res: Response) {
		try {
			let result = await db('roles')
				.withSchema('travel')
				.select('id', 'rolename');
			res.status(200).json(result);
		} catch (error: any) {
			console.log(error);
			res.status(500).json('Internal Server Error');
		}
	}
);
