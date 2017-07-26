// ----- preloader -----
$(window).on('load', function() {
    var $preloader = $('#preloader'),
        $spinner = $preloader.find('.spinner');
        $preloader.delay(100).fadeOut('slow');
        $spinner.fadeOut();
});

// ----- menu -----
$(document).ready(function() {
    var opened = false;

    $('.button').click(function() {
        (!opened) ? (
        	$('.open').css('display', 'none'),
        	$('.close').css('display', 'block'),
            $('.phone').stop(true, true).fadeIn({
            	duration: 0, queue: false
            }).slideDown(0)
        ) : (
        	$('.open').css('display', 'block'),
        	$('.close').css('display', 'none'),
            $('.phone').stop(true, true).fadeOut({
            	duration: 0, queue: false
            }).slideUp(0)
        );
            
        opened = !opened;
    });
});