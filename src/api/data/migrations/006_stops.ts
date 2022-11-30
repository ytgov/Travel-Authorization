import * as knex from 'knex';

exports.up = function (knex: knex.Knex, Promise: any) {
	return knex.schema.createTable('stops', function (t) {
		t.increments('id').notNullable().primary();
		t.integer('taid').notNullable();
		t.integer('travelFrom');
		t.integer('travelTo');
		t.specificType('departureDate', 'DATE');
		t.time('departureTime');
		t.string('transport');
		t.integer('estimate');
	});
};

exports.down = function (knex: knex.Knex, Promise: any) {
	return knex.schema.dropTable('stops');
};
