$('.js-select').click(function(){
	var selected = $(this).data('selected') ? 0 : 1;
	$.post('/select-toggle/' + selected + '/' + $(this).data('id'), function(authError){
		if(authError){
			alert(authError);
			location.href = '/login';
			return;
		}
		$(this)
			.data('selected', selected)
			.text(selected ? 'Unselect' : 'Select')
			.closest('tr')
			.toggleClass('normal-user selected-user');
	}.bind(this));
});
