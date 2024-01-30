import knex from 'knex';

const knexInstance = knex({
  client: 'mysql2',
  connection: {
		host: "IP DO SERVIDOR",
		user: "USUÁRIO DO SERVIDOR",
		password: "SENHA DO USUÁRIO",
		database: "BANCO USADO",
		port: "PORTA DO SERVIDOR - GERALMENTE 3306",
	}
});

export default knexInstance;