import express, { Request, Response } from 'express';
import { ReturnValidationErrors } from '../middleware';
import { DB_CONFIG } from '../config';
import knex from 'knex';
import axios from 'axios';
import { slice } from 'lodash';
import { stringify } from 'querystring';
const db = knex(DB_CONFIG);

export const lookupRouter = express.Router();

lookupRouter.get(
	'/destination',
	ReturnValidationErrors,
	async function (req: Request, res: Response) {
		try {
			let result = await db('destinations').select('id', 'province', 'city');
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
			let result = await db('roles').select('id', 'rolename');
			res.status(200).json(result);
		} catch (error: any) {
			console.log(error);
			res.status(500).json('Internal Server Error');
		}
	}
);

lookupRouter.get(
	'/departmentList',
	ReturnValidationErrors,
	async function (req: Request, res: Response) {
		let cleanList: any = {};
		try {
			let depList = await axios
				.get(`http://directory-api-dev.ynet.gov.yk.ca/divisions`)
				.then((resp: any) => {
					for (let slice of resp.data.divisions) {
						if (cleanList[slice.department] == null)
							cleanList[slice.department] = {};

						if (slice.division)
							if (cleanList[slice.department][slice.division] == null)
								cleanList[slice.department][slice.division] = {};

						if (slice.branch)
							if (
								cleanList[slice.department][slice.division][slice.branch] ==
								null
							)
								cleanList[slice.department][slice.division][slice.branch] = [];

						if (slice.unit)
							cleanList[slice.department][slice.division][slice.branch].push(
								slice.unit
							);
					}
					return cleanList;
				});
			res.status(200).json(depList);
		} catch (error: any) {
			console.log(error);
			res.status(500).json('Internal Server Error');
		}
	}
);

lookupRouter.get(
	'/emailList',
	ReturnValidationErrors,
	async function (req: Request, res: Response) {
		try {
			let emailList = await axios
				.get(`http://directory-api-dev.ynet.gov.yk.ca/employees`)
				.then((resp: any) => {
					let list = [];
					for (let employee of resp.data.employees) {
						if (employee.email != '') list.push(employee.email);
					}
					return list;
				});
			res.status(200).json(emailList);
		} catch (error: any) {
			console.log(error);
			res.status(500).json('Internal Server Error');
		}
	}
);

lookupRouter.get('/flightPrice', async function (req: Request, res: Response) {
	const axios = require('axios');

	const options = {
		method: 'GET',
		url: 'https://travelpayouts-travelpayouts-flight-data-v1.p.rapidapi.com/v1/prices/direct/',
		params: { destination: 'LED', origin: 'MOW' },
		headers: {
			'X-Access-Token': '77a19abf177de55e2c8027710513be95',
			'X-RapidAPI-Host':
				'travelpayouts-travelpayouts-flight-data-v1.p.rapidapi.com',
			'X-RapidAPI-Key': '94bf101f22mshfbfa967125292ecp1dbcd7jsn262338eb3eaa',
		},
	};

	// https://api.travelpayouts.com/v2/prices/latest?currency=cad&period_type=year&page=1&limit=30&show_to_affiliates=true&sorting=price&trip_class=0&token=77a19abf177de55e2c8027710513be95
	//api.travelpayouts.com/v2/prices/month-matrix?currency=usd&origin=YXY&destination=YVR&show_to_affiliates=true&token=77a19abf177de55e2c8027710513be95
	axios
		.request(options)
		.then(function (response: any) {
			console.log(response.data);
		})
		.catch(function (error: any) {
			console.error(error);
		});
});
