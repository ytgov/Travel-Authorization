import express, { Request, Response } from 'express';
import { ReturnValidationErrors } from '../middleware';
import { DB_CONFIG } from '../config';
import knex from 'knex';
import { UserService } from '../services';
import { v4 as uuid } from 'uuid';

const db = knex(DB_CONFIG);

export const formRouter = express.Router();
const userService = new UserService();

formRouter.get(
	'/',
	ReturnValidationErrors,
	async function (req: Request, res: Response) {
		try {
			let user = await userService.getByEmail(req.user.email);
			let auth = await db('auth')
				.withSchema('travel')
				.select('*')
				.where('userid', '=', user.id);

			for (let index = 0; index < auth.length; index++) {
				auth[index].stops = await db('stops')
					.withSchema('travel')
					.select('*')
					.where('taid', '=', auth[index].taid);
				let departureDate = await db('stops')
					.withSchema('travel')
					.min('arrivaldate')
					.where('taid', '=', auth[index].taid);
				auth[index].departureDate = departureDate[0].min;
			}
			res.status(200).json(auth);
		} catch (error: any) {
			console.log(error);
			res.status(500).json('Internal Server Error');
		}
	}
);

formRouter.post(
	'/',
	ReturnValidationErrors,
	async function (req: Request, res: Response) {
		try {
			await db.transaction(async (trx) => {
				let user = await userService.getByEmail(req.user.email);
				console.log('body', req.body);
				let stops = req.body.stops;
				let authInsert = {
					firstname: req.body.firstName,
					lastname: req.body.lastName,
					department: req.body.department,
					division: req.body.division,
					branch: req.body.branch,
					unit: req.body.unit,
					email: req.body.email,
					mailcode: req.body.mailcode,
					travelduration: req.body.totalTripLength,
					daysnottravel: req.body.daysNotTraveling,
					datebacktowork: req.body.backToWorkDate,
					purpose: req.body.purpose,
					traveladvance: req.body.travelAdvance,
					eventname: req.body.eventName,
					summary: req.body.summary,
					supervisoremail: req.body.supervisorEmail,
					formstatus: req.body.status,
					userid: user.id,
					formid: uuid(),
					preappid: 0,
					approved: false,
				};
				console.log('form', authInsert);
				console.log('stops', stops);
				let id = await db('auth')
					.withSchema('travel')
					.insert(authInsert, 'taid')
					.transacting(trx)
					.returning('taid');

				// for (let index = 0; index < stops.length; index++) {
				// 	let stop = {
				// 		taid: id[0],
				// 		to: stops[index].to,
				// 		from: stops[index].from,
				// 		departuredate: stops[index].departuredate,
				// 		departuretime: stops[index].departuretime,
				// 		transportation: stops[index].transportation,
				// 		estimate: 0,
				// 	};
				// 	await db('stops').withSchema('travel').insert(stop).transacting(trx);
				// }
			});
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
