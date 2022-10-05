import express, { Request, Response } from 'express';
import { ReturnValidationErrors } from '../middleware';
import { DB_CONFIG } from '../config';
import knex from 'knex';
import { UserService } from '../services';
import { v4 as uuid } from 'uuid';
import * as formHelper from '../utils/formHelper';
import { auth } from 'express-openid-connect';

const db = knex(DB_CONFIG);

const { setTypeParser, builtins } = require('pg').types;

const typesToReset = [
	builtins.DATE,
	builtins.TIME,
	builtins.TIMETZ,
	builtins.TIMESTAMP,
	builtins.TIMESTAMPTZ,
];

function resetPgDateParsers() {
	for (const pgType of typesToReset) {
		setTypeParser(pgType, (val: any) => String(val)); // like noParse() function underhood pg lib
	}
}

resetPgDateParsers();

export const formRouter = express.Router();
const userService = new UserService();

formRouter.get(
	'/',
	ReturnValidationErrors,
	async function (req: Request, res: Response) {
		try {
			let user = await userService.getByEmail(req.user.email);
			let auth = await db('forms').select('*').where('userId', '=', user.id);

			for (let index = 0; index < auth.length; index++) {
				auth[index].stops = await db('stops')
					.select('*')
					.where('taid', '=', auth[index].id);
				let departureDate = await db('stops')
					.min('departureDate')
					.where('taid', '=', auth[index].id);
				auth[index].departureDate = departureDate[0].min;
			}
			res.status(200).json(auth);
		} catch (error: any) {
			console.log(error);
			res.status(500).json('Internal Server Error');
		}
	}
);

formRouter.get(
	'/:formId',
	ReturnValidationErrors,
	async function (req: Request, res: Response) {
		try {
			let user = await userService.getByEmail(req.user.email);

			let auth = await db('forms')
				.select('*')
				.where('userId', '=', user.id)
				.andWhere('formId', '=', req.params.formId)
				.first();

			if (auth) {
				auth.stops = await db('stops').select('*').where('taid', '=', auth.id);

				res.status(200).json(auth);
			} else if (auth === undefined) {
				res.status(200).json({});
			} else {
				res.status(404).json('Form not found');
			}
		} catch (error: any) {
			console.log(error);
			res.status(500).json('Internal Server Error');
		}
	}
);

//User to save their own form
formRouter.post(
	'/:formId/save',
	ReturnValidationErrors,
	async function (req: Request, res: Response) {
		console.log('Saving Form');

		try {
			await db.transaction(async (trx) => {
				let user = await userService.getByEmail(req.user.email);

				// let authInsert =
				let stops = req.body.stops;
				delete req.body.stops;

				let authInsert = {
					userId: user.id,
					...req.body,
					formStatus: 'Draft',
					formId: req.params.formId,
				};

				let id = await db('forms')
					.insert(authInsert, 'id')
					.onConflict('formId')
					.merge();

				await db('stops')
					.delete()
					.where('taid', '=', id[0].id)
					.transacting(trx);

				for (let index = 0; index < stops.length; index++) {
					let stop = {
						taid: id[0].id,
						...stops[index],
					};
					await db('stops').insert(stop).transacting(trx);
				}
			});
			res.status(200).json({ formId: req.params.formId });
		} catch (error: any) {
			console.log(error);
			res.status(500).json('Insert failed');
		}
	}
);

//User to submit their own form
formRouter.post(
	'/:formId/submit',
	ReturnValidationErrors,
	async function (req: Request, res: Response) {
		console.log('Saving Form');

		try {
			await db.transaction(async (trx) => {
				let user = await userService.getByEmail(req.user.email);

				let stops = req.body.stops;
				delete req.body.stops;

				let authInsert = {
					userId: user.id,
					...req.body,
					formStatus: 'Submitted',
					formId: req.params.formId,
				};

				if (
					authInsert.userId &&
					authInsert.firstName &&
					authInsert.lastName &&
					authInsert.department &&
					authInsert.division &&
					authInsert.branch &&
					authInsert.unit &&
					authInsert.email &&
					authInsert.mailcode &&
					authInsert.travelDuration &&
					authInsert.daysNotTravel &&
					authInsert.dateBackToWork &&
					authInsert.purpose &&
					authInsert.travelAdvance &&
					authInsert.eventName &&
					authInsert.summary &&
					authInsert.supervisorEmail &&
					authInsert.formStatus &&
					authInsert.formId
				) {
					let id = await db('forms')
						.insert(authInsert, 'id')
						.onConflict('formId')
						.merge();

					await db('stops')
						.delete()
						.where('taid', '=', id[0].id)
						.transacting(trx);

					for (let index = 0; index < stops.length; index++) {
						let stop = {
							taid: id[0].id,
							...stops[index],
							estimate: 0,
						};
						await db('stops').insert(stop).transacting(trx);
					}
					res.status(200).json({ formId: req.params.formId });
				} else {
					res.status(500).json('Required fields in submission are blank');
				}
			});
		} catch (error: any) {
			console.log(error);
			res.status(500).json('Insert failed');
		}
	}
);

//Manager to deny travel request
formRouter.post(
	'/:formId/deny',
	ReturnValidationErrors,
	async function (req: Request, res: Response) {
		console.log('Saving Form');

		try {
			await db.transaction(async (trx) => {
				let user = await userService.getByEmail(req.user.email);

				let supervisorEmail = await db('forms')
					.select('email')
					.where('formId', '=', req.params.formId)
					.transacting(trx);

				if (
					supervisorEmail[0].email.toLowerCase() == user.email.toLowerCase()
				) {
					let denialReason = req.body.denialReason;

					let id = await db('forms')
						.update({
							denialReason: denialReason,
							formStatus: 'Denied',
						})
						.where('formId', '=', req.params.formId)
						.transacting(trx)
						.returning('id');

					res.status(200).json({ formId: req.body.formId });
				} else {
					res.status(500).json('Not authorized to deny this request');
				}
			});
		} catch (error: any) {
			console.log(error);
			res.status(500).json('Insert failed');
		}
	}
);

//Manager to approve travel request
formRouter.post(
	'/:formId/approve',
	ReturnValidationErrors,
	async function (req: Request, res: Response) {
		console.log('Saving Form');

		try {
			await db.transaction(async (trx) => {
				let user = await userService.getByEmail(req.user.email);

				let supervisorEmail = await db('forms')
					.select('email')
					.where('formId', '=', req.params.formId)
					.transacting(trx);

				if (
					supervisorEmail[0].email.toLowerCase() == user.email.toLowerCase()
				) {
					let id = await db('forms')
						.update({ formStatus: 'Approved' })
						.where('formId', '=', req.params.formId)
						.transacting(trx)
						.returning('id');

					res.status(200).json({ formId: req.body.formId });
				} else {
					res
						.status(401)
						.json('Must be assigned supervisor to approve request');
				}
			});
		} catch (error: any) {
			console.log(error);
			res.status(500).json('Insert failed');
		}
	}
);

//Manager to reassign manager
//Should put the form status back to submitted, awaiting approval
formRouter.post(
	'/:formId/reassign',
	ReturnValidationErrors,
	async function (req: Request, res: Response) {
		console.log('Reassigning Form');

		try {
			await db.transaction(async (trx) => {
				let user = await userService.getByEmail(req.user.email);

				let supervisorEmail = await db('forms')
					.select('email')
					.where('formId', '=', req.params.formId)
					.transacting(trx);

				if (
					supervisorEmail[0].email.toLowerCase() == user.email.toLowerCase()
				) {
					let reassign = req.body.reassign;

					let id = await db('forms')
						.update({
							supervisorEmail: reassign,
						})
						.where('formId', '=', req.params.formId)
						.transacting(trx)
						.returning('id');

					res.status(200).json({ formId: req.body.formId });
				} else {
					res.status(401).json('Must be supervisor to approve request');
				}
			});
		} catch (error: any) {
			console.log(error);
			res.status(500).json('Insert failed');
		}
	}
);

formRouter.post(
	'/:formId/requestChange',
	ReturnValidationErrors,
	async function (req: Request, res: Response) {
		console.log('Request Form Changes');

		try {
			await db.transaction(async (trx) => {
				let user = await userService.getByEmail(req.user.email);

				let supervisorEmail = await db('forms')
					.select('email')
					.where('formId', '=', req.params.formId)
					.transacting(trx);

				if (
					supervisorEmail[0].email.toLowerCase() == user.email.toLowerCase()
				) {
					let id = await db('forms')
						.update({
							requestChange: req.body.requestChange,
							formStatus: 'Change Requested',
						})
						.where('formId', '=', req.params.formId)
						.transacting(trx)
						.returning('id');

					res.status(200).json({ formId: req.body.formId });
				} else {
					res.status(401).json('Must be supervisor to approve request');
				}
			});
		} catch (error: any) {
			console.log(error);
			res.status(500).json('Insert failed');
		}
	}
);

//User to delete their form
//SHould just hide it in db with staus change
formRouter.delete(
	'/:formId',
	ReturnValidationErrors,
	async function (req: Request, res: Response) {
		try {
			let result = await db('forms')
				.update({
					formstatus: 'deleted',
				})
				.where('formId', '=', req.params.formId)
				.returning('formId');
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

formRouter.get(
	'/:formId/expenses',
	ReturnValidationErrors,
	async function (req: Request, res: Response) {
		let user = await userService.getByEmail(req.user.email);
		try {
			await db.transaction(async (trx) => {
				let id = await db('forms')
					.select('id')
					.where('formId', req.params.formId)
					.transacting(trx);

				let expenses = await db('expenses').select('*').transacting(trx);

				res.status(200).json(expenses);
			});
		} catch (error: any) {
			console.log(error);
			res.status(500).json('Update failed');
		}
	}
);

formRouter.post(
	'/:formId/expenses',
	ReturnValidationErrors,
	async function (req: Request, res: Response) {
		let user = await userService.getByEmail(req.user.email);
		try {
			await db.transaction(async (trx) => {
				let id = await db('forms')
					.select('id')
					.where('formId', req.params.formId)
					.transacting(trx);

				await db('expenses')
					.delete()
					.where('taid', '=', id[0].id)
					.transacting(trx);

				for (let index = 0; index < req.body.length; index++) {
					let expense = {
						taid: id[0].id,
						...req.body[index],
					};
					await db('expenses').insert(expense).transacting(trx);
				}
				res.status(200).json('Updated expenses successful');
			});
		} catch (error: any) {
			console.log(error);
			res.status(500).json('Update failed');
		}
	}
);
