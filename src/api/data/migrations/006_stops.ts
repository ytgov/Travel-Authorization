import * as knex from 'knex';

exports.up = function (knex: knex.Knex, Promise: any) {
	return knex.schema.createTable('stops', function (t) {
		t.increments('id').notNullable().primary();
		t.integer('taid').notNullable();
		t.integer('stopNumber').notNullable();
		t.integer('locationId').notNullable();
		t.specificType('departureFromLocationDate', 'DATE');
		t.time('departureFromLocationTime');
		t.string('transport');
	});
};

exports.down = function (knex: knex.Knex, Promise: any) {
	return knex.schema.dropTable('stops');
};
