// validation
var moment = require('moment');

function validateCpf(cpf){
	var i, rev, add;
	if (cpf.length != 11 || /^(\d)\1+$/.test(cpf)){
		return false;
	}
	add = 0;
	for (i = 0; i < 9; i++){
		add += cpf.charAt(i) * (10 - i);
	}
	rev = 11 - (add % 11);
	if (rev === 10 || rev === 11){
		rev = 0;
	}
	if (rev !== +cpf.charAt(9)){
		return false;
	}
	add = 0;
	for (i = 0; i < 10; i++){
		add += cpf.charAt(i) * (11 - i);
	}
	rev = 11 - (add % 11);
	if (rev === 10 || rev === 11){
		rev = 0;
	}
	if (rev !== +cpf.charAt(10)){
		return false;
	}
	return true;
}
function validateBirthdate(birthdate){
	var parsedDate = moment(birthdate, 'D/M/YYYY', true);
	return parsedDate.isValid() && parsedDate.isBefore(moment());
}

module.exports = {
	cpf: validateCpf,
	birthdate: validateBirthdate
};
