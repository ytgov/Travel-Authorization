import * as knex from 'knex';

// PreTID	smallint	PK	not null
// Department	varchar(80)
// Branch	varchar(80)
// Purpose	varchar(500)
// Reason	varchar(500)
// StartDate	date
// EndDate	date
// DateUnkInd	smallint		not null
// Month	varchar(20)
// EstimatedCost	smallint		not null
// TravelerUnkInd	smallint		not null
// NumberTravelers	smallint
// TravelerNotes	varchar (200)
// Location	varchar (80)		not null

exports.up = function (knex: knex.Knex, Promise: any) {
	return knex.schema.createTable('preapproved', function (t) {
		t.increments('preTID').notNullable().primary();
		t.string('department');
		t.string('branch');
		t.string('purpose');
		t.string('reason');
		t.date('startDate');
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
	return knex.schema.dropTable('preapproved');
};
