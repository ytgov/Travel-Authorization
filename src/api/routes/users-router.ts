import express, { Request, Response } from 'express';
import { DB_CONFIG } from '../config';
import knex from 'knex';
import { ReturnValidationErrors } from '../middleware';
import { param, query } from 'express-validator';
import { UserService } from '../services';

export const userRouter = express.Router();
const db = knex(DB_CONFIG);
const userService = new UserService();

userRouter.get('/me', async (req: Request, res: Response) => {
	let person = req.user;

	if (person) return res.json({ data: await makeDTO(person) });
});

async function makeDTO(userRaw: any) {
	let dto = userRaw;
	dto.display_name = `${userRaw.first_name} ${userRaw.last_name}`;
	//dto.roles = _.split(userRaw.roles, ",").filter(r => r.length > 0);
	//dto.access = await db.getAccessFor(userRaw.email);
	//dto.display_access = _.join(dto.access.map((a: any) => a.level), ", ")

	return dto;
}

userRouter.get('/', async (req: Request, res: Response) => {
	try {
		let users = await userService.getAll();
		res.status(200).json(users);
	} catch (error: any) {
		console.log(error);
		res.status(500).json('Internal Server Error');
	}
});

userRouter.put('/:id/permissions', async (req: Request, res: Response) => {
	try {
		await userService.saveDepartmentAccess(req.params.id, req.body.departments);
		await userService.saveRoleAccess(req.params.id, req.body.roles);
		res.status(200).json('Saved permissions');
	} catch (error: any) {
		console.log(error);
		res.status(500).json('Internal Server Error');
	}
});

userRouter.get('/:id/permissions', async (req: Request, res: Response) => {
	try {
		let departments = await userService.getDepartmentAccess(req.params.id);
		let roles = await userService.getRoleAccess(req.params.id);
		let permissions = { departments: departments, roles: roles };
		res.status(200).json(permissions);
	} catch (error: any) {
		console.log(error);
		res.status(500).json('Internal Server Error');
	}
});

userRouter.get('/:id', async (req: Request, res: Response) => {
	try {
		let users = await userService.getById(req.params.id);
		res.status(200).json(users);
	} catch (error: any) {
		console.log(error);
		res.status(500).json('Internal Server Error');
	}
});
