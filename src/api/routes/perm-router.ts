import express, { Request, Response } from 'express';
import { ReturnValidationErrors } from '../middleware';
import { DB_CONFIG } from '../config';
import knex from 'knex';
import { UserService } from '../services';

const db = knex(DB_CONFIG);

export const permRouter = express.Router();
const userService = new UserService();

permRouter.get(
	'/',
	ReturnValidationErrors,
	async function (req: Request, res: Response) {
		try {
			let users = await userService.getAccessFor('Max.parker@yukon.ca');
			res.status(200).json(users);
		} catch (error: any) {
			console.log(error);
			res.status(500).json('Internal Server Error');
		}
	}
);

permRouter.post(
	'/',
	ReturnValidationErrors,
	async function (req: Request, res: Response) {
		try {
			await db.transaction(async (trx) => {
				let user = await userService.getByEmail(req.user.email);
				let stops = req.body.stops;
				let authInsert = {
					firstname: req.body.firstname,
					lastname: req.body.lastname,
					department: req.body.department,
					branch: req.body.branch,
					summary: req.body.summary,
					daysnottravel: req.body.daysnotTravel,
					travelduration: req.body.travelduartion,
					datebacktowork: req.body.datebacktowork,
					userid: user.id,
					preappid: 0,
					approved: false,
				};

				let id = await db('auth')
					.insert(authInsert, 'taid')
					.transacting(trx)
					.returning('taid');

				for (let index = 0; index < stops.length; index++) {
					let stop = {
						taid: id[0],
						destination: stops[index].destination,
						arrivaldate: stops[index].arrivaldate,
						departuredate: stops[index].departuredate,
					};
					await db('stops').insert(stop).transacting(trx);
				}
			});
		} catch (error: any) {
			console.log(error);
			res.status(500).json('Insert failed');
		}
	}
);

permRouter.delete(
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

permRouter.put(
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
