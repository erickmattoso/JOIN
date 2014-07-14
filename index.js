var express = require('express');
var dustjs =  require('adaro');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var validate = require('./models/validate');
var db = require('./models/db');
var _ = require('lodash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	db.Admin.find({
		where: { id: id }
	}).complete(function(err, user) {
		done(null, user.values);
	});
});

passport.use(new LocalStrategy(function(username, password, done) {
	db.Admin.find({
		where: { username: username }
	}).complete( function(err, user) {
		if (err) {
			return done(err);
		}
		if (!user) {
			return done(null, false, { message: 'Incorrect username.' });
		}
		if (user.password !== password) {
			return done(null, false, { message: 'Incorrect password.' });
		}
		return done(null, user);
	});
}));

var app = express();

app.engine('dust', dustjs.dust({
	layout: 'layouts/main',
	cache: app.get('env') !== 'development'
}));

app.set('view engine', 'dust');
app.set('views', path.join(__dirname, 'views'));

app.use(cookieParser());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(session({
	secret: 'jasuiah9897875745453',
	resave: true,
	saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
	res.render('index', {
		title: 'Home',
		user: req.user
	});
});

app.get('/signup', function(req, res){
	res.render('register', {
		title: 'Sign up',
		user: req.user
	});
});

app.post('/signup', function(req, res){
	function sendWarning(message, field){
		res.send({
			error: true,
			message: message,
			field: field,
			user: req.user
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
app.get('/login', function(req, res){
	res.render('login', {
		title: 'Login',
		message: req.flash('error')
	});
});
app.post('/login',
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true
	}));
app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});
app.get('/registered-users', function(req, res){
	if(!req.user){
		return res.redirect('/login');
	}
	db.User.findAll().success(function(users) {
		res.render('usersList', {
			title: 'User list',
			pageName: 'Registered',
			user: req.user,
			users: users.map(function(instance){
				return instance.values;
			})
		});
	});
});
app.get('/selected-users', function(req, res){
	if(!req.user){
		return res.redirect('/login');
	}
	db.User.findAll({
		where: {
			isSelected: true
		}
	}).success(function(users) {
		res.render('usersList', {
			title: 'User list',
			pageName: 'Selected',
			user: req.user,
			users: users.map(function(instance){
				return instance.values;
			})
		});
	});
});
app.post('/select-toggle/:selected/:id', function(req, res){
	if(!req.user){
		return res.send('Authentication Error: Please login again.');
	}
	console.log(typeof req.params.selected);
	db.User.find({
		where: {
			id: req.params.id
		}
	}).success(function(user){
		user.isSelected = +req.params.selected === 1;
		user.save().success(function(){
			res.send('');
		});
	});
});





app.listen(1337);
