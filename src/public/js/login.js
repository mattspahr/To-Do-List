$(document).on('click', '#btn-show-login', function () {
    $('#signup').hide();
    $('#login').fadeIn(600);
    $('#btn-show-login').attr('class', 'active');
    $('#btn-show-signup').attr('class', 'inactive');

});

$(document).on('click', '#btn-show-signup', function () {
    $('#login').hide();
    $('#signup').fadeIn(600);
    $('#btn-show-signup').attr('class', 'active');
    $('#btn-show-login').attr('class', 'inactive');
});
