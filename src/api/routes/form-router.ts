import express, { Request, Response } from 'express';
import { ReturnValidationErrors } from '../middleware';
import { DB_CONFIG } from '../config';
import knex from 'knex';
import { UserService } from '../services';
import { v4 as uuid } from 'uuid';
import * as formHelper from '../utils/formHelper';
import { auth } from 'express-openid-connect';

const db = knex(DB_CONFIG);

export const formRouter = express.Router();
const userService = new UserService();

formRouter.get(
	'/',
	ReturnValidationErrors,
	async function (req: Request, res: Response) {
		try {
			let user = await userService.getByEmail(req.user.email);
			let auth = await db('forms').select('*').where('userid', '=', user.id);

			for (let index = 0; index < auth.length; index++) {
				auth[index].stops = await db('stops')
					.select('*')
					.where('taid', '=', auth[index].taid);
				let departureDate = await db('stops')
					.min('departuredate')
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

formRouter.get(
	'/:formId',
	ReturnValidationErrors,
	async function (req: Request, res: Response) {
		try {
			let user = await userService.getByEmail(req.user.email);

			let auth = await db('forms')
				.select('*')
				.where('userid', '=', user.id)
				.andWhere('formid', '=', req.params.formId)
				.first();

			if (auth) {
				let webForm = auth;

				webForm.stops = await db('stops')
					.select('*')
					.where('taid', '=', auth.taid);

				res.status(200).json(webForm);
			}
			res.status(404).json('Form not found');
		} catch (error: any) {
			console.log(error);
			res.status(500).json('Internal Server Error');
		}
	}
);

//Gets a blank form for first time creation
formRouter.get(
	'/blank',
	ReturnValidationErrors,
	async function (req: Request, res: Response) {
		try {
			let today = new Date();

			let webForm = {
				firstName: '',
				lastName: '',
				department: '',
				division: '',
				branch: '',
				unit: '',
				email: '',
				mailcode: '',
				totalTripLength: 0,
				daysNotTraveling: 0,
				travelAdvance: 0,
				backToWorkDate: today.toISOString().substr(0, 10),
				purpose: '',
				eventName: '',
				summary: '',
				supervisorEmail: '',
				status: '',
				formId: '',
				stops: [],
			};

			res.status(200).json(webForm);
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

				console.log(authInsert);

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
					authInsert.userid &&
					authInsert.firstname &&
					authInsert.lastname &&
					authInsert.department &&
					authInsert.division &&
					authInsert.branch &&
					authInsert.unit &&
					authInsert.email &&
					authInsert.mailcode &&
					authInsert.travelduration &&
					authInsert.daysnottravel &&
					authInsert.datebacktowork &&
					authInsert.purpose &&
					authInsert.traveladvance &&
					authInsert.eventname &&
					authInsert.summary &&
					authInsert.supervisoremail &&
					authInsert.formstatus &&
					authInsert.formid
				) {
					let id = await db('forms')
						.insert(authInsert, 'taid')
						.onConflict('formid')
						.merge();

					await db('stops')
						.delete()
						.where('taid', '=', id[0].taid)
						.transacting(trx);

					for (let index = 0; index < stops.length; index++) {
						let stop = {
							taid: id[0].taid,
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
					.where('formid', '=', req.params.formId)
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
						.where('formid', '=', req.params.formId)
						.transacting(trx)
						.returning('taid');

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
					.where('formid', '=', req.params.formId)
					.transacting(trx);

				if (
					supervisorEmail[0].email.toLowerCase() == user.email.toLowerCase()
				) {
					let id = await db('forms')
						.update({ formstatus: 'approved' })
						.where('formid', '=', req.params.formId)
						.transacting(trx)
						.returning('taid');

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
					.where('formid', '=', req.params.formId)
					.transacting(trx);

				if (
					supervisorEmail[0].email.toLowerCase() == user.email.toLowerCase()
				) {
					let reassign = req.body.reassign;

					let id = await db('forms')
						.update({
							supervisoremail: reassign,
						})
						.where('formid', '=', req.params.formId)
						.transacting(trx)
						.returning('taid');

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
					.where('formid', '=', req.params.formId)
					.transacting(trx);

				if (
					supervisorEmail[0].email.toLowerCase() == user.email.toLowerCase()
				) {
					let requestChange = req.body.requestedChange;
					let id = await db('forms')
						.update({
							requestchange: requestChange,
							formstatus: 'changeRequested',
						})
						.where('formid', '=', req.params.formId)
						.transacting(trx)
						.returning('taid');

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
				.where('formid', '=', req.params.formId)
				.returning('formid');
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

formRouter.post(
	'/:formId/expense',
	ReturnValidationErrors,
	async function (req: Request, res: Response) {
		let user = await userService.getByEmail(req.user.email);
		try {
			await db('forms')
				.delete()
				.where('taid', '=', req.params.formId)
				.andWhere('supervisoremail', '=', user.email)
				// .orWhere('email','=',req.body.email)
				.update({ status: req.body.status, changes: req.body.changes });
			console.log('Entry updated', req.body);
			res.status(200).json('Updated successful');
		} catch (error: any) {
			console.log(error.name, error.detail);
			res.status(500).json('Update failed');
		}
	}
);
