import express, { Request, Response } from 'express';
import { ReturnValidationErrors } from '../middleware';
import { DB_CONFIG } from '../config';
import knex from 'knex';
import { UserService } from '../services';
import { v4 as uuid } from 'uuid';
import * as formHelper from '../utils/formHelper';
import { auth } from 'express-openid-connect';
import { report } from 'process';

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

export const travelDeskRouter = express.Router();
const userService = new UserService();

travelDeskRouter.get(
	'/travel-desk',
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		//The CD vendor might have address
		
	}


