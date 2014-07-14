var Sequelize = require('sequelize');
var sequelize = new Sequelize('join', 'root', '', {
	dialect: 'mysql',
	port: 3306
});

var User = sequelize.define('User', {
	name: Sequelize.STRING,
	lastname: Sequelize.STRING,
	birthdate: Sequelize.STRING,
	cpf: Sequelize.STRING,
	city: Sequelize.STRING,
	phoneCod: Sequelize.STRING,
	phone: Sequelize.STRING,
	email: Sequelize.STRING,
	comment: Sequelize.STRING,
	isAdmin: {
		type: Sequelize.BOOLEAN,
		defaultValue: false
	}
});

module.exports = {
	sequelize: sequelize,
	User: User
};
