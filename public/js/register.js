$('#register-form').submit(function(event){
	event.preventDefault();
	$('.warning').remove();
	$.post('/signup', $(this).serialize(), function(data){
		if (data.error){
			var $message = $('<span>', {
				'class': 'warning',
				'text': data.message
			});
			$('#' + data.field).after($message);
			return;
		}
		alert(data.message);
		location.href = '/';

	}, 'json');
});
