/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    {id: 1, firstname: 'Tiffany', lastname: 'Crick', username: 'tiffystar', password: 'password1'},
    {id: 2, firstname: 'Charles', lastname: 'Bronson', username: 'avtandilius', password: 'password2'},
    {id: 3, firstname: 'Athena', lastname: 'Medea', username: 'theta', password: 'password3'},
    {id: 4, firstname: 'Alexandra', lastname: 'Elenalinn', username: 'landa', password: 'password4'}
  ]);
};
