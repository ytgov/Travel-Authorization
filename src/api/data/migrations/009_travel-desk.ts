import * as knex from 'knex';

exports.up = function (knex: knex.Knex, Promise: any) {
	return knex.schema.createTable('travelDesk', function (t) {
		t.increments('id').notNullable().primary();
		t.string('taid');
		t.string('address');
		t.string('city');
		t.string('province');
		t.date('postal code');
		t.date('endDate');
		t.integer('dateUnkInd').notNullable();
		t.string('month');
		t.integer('estimatedCost').notNullable();
		t.integer('travelerUnkInd').notNullable();
		t.integer('numberTravelers');
		t.string('travelerNotes');
		t.string('location').notNullable();
	});
};

exports.down = function (knex: knex.Knex, Promise: any) {
	return knex.schema.dropTable('travelDesk');
};
