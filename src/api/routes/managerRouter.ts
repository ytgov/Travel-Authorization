import express, { Request, Response } from 'express';
import { DB_CONFIG } from '../config';
import knex from 'knex';
import { ReturnValidationErrors } from '../middleware';
import { param, query } from 'express-validator';

export const ownerRouter = express.Router();
const db = knex(DB_CONFIG);

ownerRouter.get(
	'/',
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		//get all forms you are the manager for
	}
);

ownerRouter.get(
	'/:ownerId',
	[param('ownerId').notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		//get single from you are the manager for
	}
);

ownerRouter.put(
	'/:ownerId',
	[param('ownerId').notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		/*   const db = req.app.get('db');
	  const permissions = req.decodedToken['yg-claims'].permissions;
	  if (!permissions.includes('edit')) res.sendStatus(403);
	 */
		const { ownerId } = req.params;
		const { owner = {}, newOwnerAlias = [], editOwnerAlias = [] } = req.body;
		const { OwnerName } = owner;

		await db('boat.owner')
			.update({ OwnerName })
			.where('boat.owner.id', ownerId);

		let newArray = [];
		// const editArray = [];

		newArray = newOwnerAlias.map((alias: any) => {
			return { OwnerId: ownerId, ...alias };
		});

		await db
			.insert(newArray)
			.into('boat.OwnerAlias')
			.returning('*')
			.then((rows: any) => {
				return rows;
			});

		for (const obj of editOwnerAlias) {
			await db('boat.OwnerAlias')
				.update({ Alias: obj.Alias })
				.where('boat.OwnerAlias.id', obj.Id);
		}

		res.status(200).send({ message: 'success' });
	}
);

// changed this route from "/new" to "/" to follow RESTFUL conventions
ownerRouter.post('/', async (req: Request, res: Response) => {
	/*   const db = req.app.get('db');
  
	const permissions = req.decodedToken['yg-claims'].permissions;
	if (!permissions.includes('create')) res.sendStatus(403); */

	const { owner = {}, ownerAlias = [] } = req.body;

	const response = await db
		.insert(owner)
		.into('boat.owner')
		.returning('*')
		.then(async (rows: any) => {
			const newOwner = rows[0];

			if (ownerAlias.length) {
				const newOwnerAlias = ownerAlias.map((alias: any) => ({
					...alias,
					OwnerId: newOwner.Id,
				}));

				await db
					.insert(newOwnerAlias)
					.into('boat.OwnerAlias')
					.returning('*')
					.then((rows: any) => {
						return rows;
					});
			}

			return newOwner;
		});

	res.status(200).send(response);
});
