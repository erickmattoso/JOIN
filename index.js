//back-end view
var express = require('express');
var dustjs =  require('adaro');
var path = require('path');
var bodyParser = require('body-parser');
var validate = require('./models/validate');
var db = require('./models/db');
var _ = require('lodash');

var app = express();

app.engine('dust', dustjs.dust({
	layout: 'layouts/main',
	cache: app.get('env') !== 'development'
}));

app.set('view engine', 'dust');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
	extended: true
}));

app.get('/', function(req, res){
	res.render('helloWorld', {
		oi: ' oi',
		title: 'Sign up'
	});

});

app.get('/signup', function(req, res){
	res.render('register', {
		title: 'Sign up'
	});

});

app.post('/signup', function(req, res){
	function sendWarning(message, field){
		res.send({
			error: true,
			message: message,
			field: field
		});
	}

	var fieldNames = [
		'name',
		'lastname',
		'birthdate',
		'cpf',
		'city',
		'phoneCod',
		'phone',
		'email'
	];

	var emptyField = fieldNames.some(function(field){
		if(!req.body[field]) {
			sendWarning('You have to fill all fields.', field);
			return true;
		}
	});

	if(emptyField){
		return;
	}

	//TODO validar dados
	if (req.body.name.length < 2){
		return sendWarning('Please check your name.', 'name');
	}
	if (req.body.lastname.length < 2){
		return sendWarning('Please check your last name.', 'lastname');
	}
	if (!validate.birthdate(req.body.birthdate)){
		return sendWarning('Please check your birthdate.', 'birthdate');
	}
	req.body.cpf = req.body.cpf.replace(/\D/g, '');
	if (!validate.cpf(req.body.cpf)){
		return sendWarning('Please check your CPF.', 'cpf');
	}
	if (req.body.email.indexOf('@') === -1){
		return sendWarning('Please check your email.', 'email');
	}


	var userData = _.pick(req.body, fieldNames);
	userData.comment = req.body.comment || '';

	db.User.create(userData).complete(function(err, user){
		if(err){
			throw err;
		}
		res.send({
			error: false,
			message: 'The user has been successfully created!'
		});

	});

});

db.sequelize.sync(
	// { force: true }
).complete(function(err){
	if(err){
		throw err;
	}
	app.listen(1337); // http://localhost:1337/
});

