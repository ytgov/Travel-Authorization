const express = require('express');
const knex = require('../data');

const ppRouter = express.Router();
module.exports = ppRouter;

ppRouter.get('/', async function (req: Request, res: Response) {
	try {
		let result = await knex('Entries').select('*');
		res.status(200).json(result);
	} catch (error: any) {
		console.log(error.name, error.detail);
		res.status(500).json('Internal Server Error');
	}
});

ppRouter.get('/:id', async function (req: Request, res: Response) {
	try {
		let result = await knex('Entries')
			.select('*')
			.where('id', '=', req.params.id);
		res.status(200).json(result);
	} catch (error: any) {
		console.log(error.name, error.detail);
		res.status(500).json('Internal Server Error');
	}
});

ppRouter.post('/', async function (req: Request, res: Response) {
	try {
		await knex('Entries').insert(req.body);
		console.log('Insert successful', req.body);
		res.status(200).json('Insert successful');
	} catch (error: any) {
		console.log(error.name, error.detail);
		res.status(500).json('Insert failed');
	}
});

ppRouter.delete('/:id', async function (req: Request, res: Response) {
	try {
		let result = await knex('Entries').where('id', '=', req.params.id).del();
		if (result) {
			res.status(200).json('Delete successful');
			console.log('Delete successful', req.params.id);
		} else {
			res.status(500).json('Delete failed');
		}
	} catch (error: any) {
		res.status(500).json('Delete failed');
	}
});

ppRouter.put('/:id', async function (req: Request, res: Response) {
	try {
		await knex('Entries').where('id', '=', req.params.id).update(req.body);
		console.log('Entry updated', req.body);
		res.status(200).json('Updated successful');
	} catch (error: any) {
		console.log(error.name, error.detail);
		res.status(500).json('Update failed');
	}
});
