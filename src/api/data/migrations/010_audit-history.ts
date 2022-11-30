import * as knex from 'knex';

exports.up = function (knex: knex.Knex, Promise: any) {
	return knex.schema.createTable('preapproved', function (t) {
		t.increments('id').notNullable().primary();
		t.string('userid');
		t.string('taid');
		t.string('action');
		t.datetime('timestamp');
	});
};

exports.down = function (knex: knex.Knex, Promise: any) {
	return knex.schema.dropTable('preapproved');
};
