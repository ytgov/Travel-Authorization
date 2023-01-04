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

//USER
//get all your forms + expenses
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

//submit a new form (becomes yours)
formRouter.get(
	'/:formId',
	ReturnValidationErrors,
	async function (req: Request, res: Response) {
		try {
			let user = await userService.getByEmail(req.user.email);
			let auth = await db('auth')
				.withSchema('travel')
				.select('*')
				.where('userid', '=', user.id)
				.andWhere('formid', '=', req.params.formId);

			for (let index = 0; index < auth.length; index++) {
				auth[0].stops = await db('stops')
					.withSchema('travel')
					.select('*')
					.where('taid', '=', auth[0].taid);
			}
			let stops = [];
			for (let stop of auth[0].stops) {
				console.log(stop);
				stops.push({
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

			let webForm = {
				firstName: auth[0].firstname,
				lastName: auth[0].lastname,
				department: auth[0].department,
				division: auth[0].division,
				branch: auth[0].branch,
				unit: auth[0].unit,
				email: auth[0].email,
				mailcode: auth[0].mailcode,
				totalTripLength: auth[0].travelduration,
				daysNotTraveling: auth[0].daysnottravel,
				travelAdvance: auth[0].traveladvance,
				backToWorkDate: new Date(auth[0].datebacktowork)
					.toISOString()
					.substr(0, 10),
				purpose: auth[0].purpose,
				eventName: auth[0].eventname,
				summary: auth[0].summary,
				supervisorEmail: auth[0].supervisoremail,
				status: auth[0].formstatus,
				formId: auth[0].formid,
				stops: stops,
			};

			console.log(webForm);

			res.status(200).json(webForm);
		} catch (error: any) {
			console.log(error);
			res.status(500).json('Internal Server Error');
		}
	}
);

//save YOUR form (regardless of completetion)

//delete your form

//add an expense to your trip

//delete an expense from your trip

//MANAGER
//get forms assgined to you + expenses

//approve a form

//deny a form

//add a note and request a change to a form

//FORM data model additions
//manager change notes
//assigned to

//FINANCE
//view all forms

//approve expenses
