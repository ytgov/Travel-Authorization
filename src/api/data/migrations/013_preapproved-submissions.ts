import * as knex from 'knex';

exports.up = function (knex: knex.Knex, Promise: any) {
    return knex.schema
        .createTable('preapprovedSubmissions', function (t) {
            t.increments('preTSubID').notNullable().primary();		
            t.string('submitter').notNullable();
            t.string('status').notNullable();
            t.date('submissionDate').defaultTo(knex.fn.now());
            t.date('approvalDate');
            t.string('approvedBy');
            t.string('department');
        })
        .alterTable('preapproved', function (t) {
            t.string('status');
        	t.integer('preTSubID').unsigned();
            t.foreign('preTSubID').references('preTSubID').inTable('preapprovedSubmissions').onDelete('SET NULL');
        });
};

exports.down = function (knex: knex.Knex, Promise: any) {
    return knex.schema        
        .alterTable('preapproved', function (t) {        	
        	t.dropForeign('preTSubID');
            t.dropColumn('preTSubID');
            t.dropColumn('status');
        })
        .dropTable('preapprovedSubmissions');
};
