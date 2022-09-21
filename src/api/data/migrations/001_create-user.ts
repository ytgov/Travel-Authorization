import * as knex from 'knex';

exports.up = function (knex: knex.Knex, Promise: any) {
	return knex.schema.createTable('user', function (t) {
		t.increments('id').notNullable().primary();
		t.string('email').notNullable();
		t.boolean('is_active').notNullable().defaultTo(true);
		t.string('first_name').notNullable();
		t.string('last_name').notNullable();
		t.timestamp('create_date').notNullable().defaultTo(knex.fn.now());
	});
};

exports.down = function (knex: knex.Knex, Promise: any) {
	return knex.schema.dropTable('user');
};
