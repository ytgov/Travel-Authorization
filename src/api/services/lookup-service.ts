import knex, { Knex } from 'knex';
import { DB_CONFIG } from '../config';
import _, { map } from 'lodash';
import axios from 'axios';
import { timeStamp } from 'console';

export class LookupService {
	private db: Knex;

	constructor() {
		this.db = knex(DB_CONFIG);
	}

	async function(req: Request, res: Response) {
		try {
			let emailList = await axios
				.get(`http://directory-api-dev.ynet.gov.yk.ca/employees`)
				.then((resp: any) => {
					for (let employee of resp.data.employees) {
						if (employee.email != '')
							this.db('emailList').insert(employee.email);
						return;
					}
				});
			return emailList;
		} catch (error: any) {
			console.log(error);
			return [];
		}
	}
}
