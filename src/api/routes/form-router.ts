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
				stops: new Array<any>(),
			};

			let auth = await db('auth')
				.withSchema('travel')
				.select('*')
				.where('userid', '=', user.id)
				.andWhere('formid', '=', req.params.formId);

			if (auth[0]) {
				for (let index = 0; index < auth.length; index++) {
					auth[0].stops = await db('stops')
						.withSchema('travel')
						.select('*')
						.where('taid', '=', auth[0].taid);
				}

				for (let stop of auth[0].stops) {
					console.log(stop);
					webForm.stops.push({
						from: stop.travelfrom,
						to: stop.travelto,
						departuretime: stop.departuretime,
						departuredate: new Date(stop.departuredate)
							.toISOString()
							.substr(0, 10),
						transport: stop.transport,
						estimate: stop.estimate,
					});
				}
				webForm.firstName = auth[0].firstname;
				webForm.lastName = auth[0].lastname;
				webForm.department = auth[0].department;
				webForm.division = auth[0].division;
				webForm.branch = auth[0].branch;
				webForm.unit = auth[0].unit;
				webForm.email = auth[0].email;
				webForm.mailcode = auth[0].mailcode;
				webForm.totalTripLength = auth[0].travelduration;
				webForm.daysNotTraveling = auth[0].daysnottravel;
				webForm.travelAdvance = auth[0].traveladvance;
				webForm.backToWorkDate = new Date(auth[0].datebacktowork)
					.toISOString()
					.substr(0, 10);
				webForm.purpose = auth[0].purpose;
				webForm.eventName = auth[0].eventname;
				webForm.summary = auth[0].summary;
				webForm.supervisorEmail = auth[0].supervisoremail;
				webForm.status = auth[0].formstatus;
				webForm.formId = auth[0].formid;
			}

			res.status(200).json(webForm);
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

				let authInsert = {
					userid: user.id,
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
					formstatus: 'save',
					formid: req.params.formId,
				};

				let id = await db('auth')
					.withSchema('travel')
					.insert(authInsert, 'taid')
					.onConflict('formid')
					.merge();

				await db('stops')
					.withSchema('travel')
					.delete()
					.where('taid', '=', id[0].taid)
					.transacting(trx);

				for (let index = 0; index < req.body.stops.length; index++) {
					let stop = {
						taid: id[0].taid,
						travelfrom: req.body.stops[index].from,
						travelto: req.body.stops[index].to,
						departuredate: req.body.stops[index].departuredate,
						departuretime: req.body.stops[index].departuretime,
						transport: req.body.stops[index].transport,
						estimate: 0,
					};
					await db('stops').withSchema('travel').insert(stop).transacting(trx);
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

				let authInsert = {
					userid: user.id,
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
					formstatus: 'submit',
					formid: req.body.formId,
				};

				const nulls = Object.values(authInsert).filter((p) => p === null);

				if (nulls.length === 0) {
					let id = await db('auth')
						.withSchema('travel')
						.update(authInsert)
						.where('formid', '=', authInsert.formid)
						.transacting(trx)
						.returning('taid');

					for (let index = 0; index < req.body.stops.length; index++) {
						let stop = {
							taid: id[0],
							travelfrom: req.body.stops[index].from,
							travelto: req.body.stops[index].to,
							departuredate: req.body.stops[index].departuredate,
							departuretime: req.body.stops[index].departuretime,
							transport: req.body.stops[index].transport,
							estimate: 0,
						};
						await db('stops')
							.withSchema('travel')
							.insert(stop)
							.transacting(trx);
					}
					res.status(200).json({ formId: req.body.formId });
				} else {
					res.status(500).json('Nulls found in submission');
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

				let denialReason = req.body.denialReason;

				let id = await db('auth')
					.withSchema('travel')
					.update({ denialreason: denialReason, status: 'denied' })
					.where('formid', '=', req.params.formId)
					.transacting(trx)
					.returning('taid');

				res.status(200).json({ formId: req.body.formId });
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

				let supervisorEmail = await db('auth')
					.withSchema('travel')
					.select('email')
					.where('formid', '=', req.params.formId)
					.transacting(trx);

				if (supervisorEmail == user.email) {
					let denialReason = req.body.denialReason;

					let id = await db('auth')
						.withSchema('travel')
						.update({ denialreason: denialReason, status: 'denied' })
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

//Manager to reassign manager
//Should put the form status back to submitted, awaiting approval
formRouter.post(
	'/:formId/reassign',
	ReturnValidationErrors,
	async function (req: Request, res: Response) {
		console.log('Saving Form');

		try {
			await db.transaction(async (trx) => {
				let user = await userService.getByEmail(req.user.email);

				let supervisorEmail = await db('auth')
					.withSchema('travel')
					.select('email')
					.where('formid', '=', req.params.formId)
					.transacting(trx);

				if (supervisorEmail == user.email) {
					let reassign = req.body.reassign;

					let id = await db('auth')
						.withSchema('travel')
						.update({ supervisoremail: reassign })
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

formRouter.post(
	'/:formId/expense',
	ReturnValidationErrors,
	async function (req: Request, res: Response) {
		let user = await userService.getByEmail(req.user.email);
		try {
			await db('auth')
				.withSchema('travel')
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
