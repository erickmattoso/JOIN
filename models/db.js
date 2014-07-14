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
	isSelected: {
		type: Sequelize.BOOLEAN,
		defaultValue: false
	}
});
var Admin = sequelize.define('Admin', {
	username: Sequelize.STRING,
	password: Sequelize.STRING
});

sequelize.sync(
	// { force: true }
	).complete(function(err){
		if(err){
			throw err;
		}
});

Admin.findOrCreate({
	username: 'root',
	password: 'test'
});

module.exports = {
	// sequelize: sequelize,
	User: User,
	Admin: Admin
};
