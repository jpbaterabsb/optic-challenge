import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema
    .createTable('voter', function(table) {
      table.string('address').primary();
      table.date('date_of_birth').notNullable();
      table.string('email').notNullable();
    })
    .createTable('voting_result', function(table) {
      table.string('option').primary();
      table.decimal('amount').notNullable();
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema
    .dropTable('voting_result')
    .dropTable('voter');
}

