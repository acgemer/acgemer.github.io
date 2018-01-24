$(document).ready(function() {

	// Хранение переменных

	var accordion_head = $('.accordion > li > a'),
		accordion_body = $('.accordion li > .sub-menu'),
		accordion_body_link = $('.accordion li > .sub-menu > li > a'),
		accordion_sub_body = $('.accordion li > .sub-menu li > .sub-menu2');

	// Открытие первой вкладки при загрузке
	accordion_body_link.first().addClass('active').next().slideDown('normal');
	accordion_head.first().addClass('active').next().slideDown('normal');
	

	accordion_head.on('click', function(event) {

		// Отключить заголовок ссылки

		event.preventDefault();

		if ($(this).attr('class') != 'active'){
			accordion_body.slideUp('normal');
			$(this).next().stop(true,true).slideToggle('normal');
			accordion_head.removeClass('active');
			$(this).addClass('active');
		}
		
	});
	
	accordion_body_link.on('click', function(event) {

		// Отключить заголовок ссылки

		event.preventDefault();

		if ($(this).attr('class') != 'active'){
			accordion_sub_body.slideUp('normal');
			$(this).next().stop(true,true).slideToggle('normal');
			accordion_body_link.removeClass('active');
			$(this).addClass('active');
		}

	});

});

$(function(){
	$('#cart_link').click(function(){
		$("#cart_link").css("opacity", "0.0");
		$("#cart_link").css("display", "none");
		$("#cart_block").delay(300).animate({top: "+=80px"}, 1000 );
		$("#cart_content").delay(1300).css("display", "block");
		$("#cart_content").animate({opacity:'1.0'},600);
	});
	
	$('#cart_content').click(function(){
		$("#cart_content").css("opacity", "0.0");
		$("#cart_content").css("display", "none");
		$("#cart_block").delay(300).animate({top: "-=80px"}, 1000 );
		$("#cart_link").delay(1300).css("display", "block");
		$("#cart_link").animate({opacity:'1.0'},600);
	});	
	
	if( typeof( $.fn.mask ) !== 'undefined' ) {
		$('input[name="phone"]').mask('+7 (999) 999 99 99');
	}
	if( typeof( $.fn.mask ) !== 'undefined' ) {
		$('input[name="Profile[phone]"]').mask('+7 (999) 999 99 99');
	}
	
	$('.nav ul.menu > li').each( 
		function(){
			var $item = $(this);
			var $subMenu = $(this).find('>.dropdown-menu');
			if( $subMenu.length > 0 ) {
				$item.on(
					'mouseover',
					function() {
						$item.addClass('open');
						$subMenu.addClass('open').stop().slideDown();
					}
				).on(
					'mouseout',
					function(){
						$item.removeClass('open');
						$subMenu.removeClass('open').stop().slideUp();
					}
				);
				$subMenu.on(
					'mouseover',
					function() {
						return true;
					}
				).on(
					'mouseout',
					function(){
						return true;
					}
				);
			}
		}
	);
	/*var $panel = $('.vremia.cabinet');
	if( $panel.length > 0 ) {
		var $pos = $panel.position();
		$(document).on(
			'scroll',
			function(){
				var scrollTop = $('html').scrollTop() || $('body') && $('body').scrollTop() || 0;
				if( scrollTop - 100 > $pos.top ) {
					$panel.addClass('fixed');
				} else {
					$panel.removeClass('fixed');
				}
			}
		);
		
		
	}*/
	

});
