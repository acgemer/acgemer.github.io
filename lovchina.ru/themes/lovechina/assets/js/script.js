$(function(){
	$('.news_carousel').slick({
	  dots: false,
	  infinite: false,
	  speed: 300,
	  slidesToShow: 3,
	  slidesToScroll: 1,
	  responsive: [
		{
		  breakpoint: 1024,
		  settings: {
		    slidesToShow: 3,
		    slidesToScroll: 3,
		    infinite: true,
		    dots: false
		  }
		},
		{
		  breakpoint: 780,
		  settings: {
		    slidesToShow: 2,
		    slidesToScroll: 2
		  }
		},
		{
		  breakpoint: 420,
		  settings: {
		    slidesToShow: 1,
		    slidesToScroll: 1
		  }
		}

	  ]
	});
	
	$('.fancybox').fancybox({});
});

$(document).ready(function(){
  $('.pull1').click(function(){
 $(this).parents('.header').find('.search').slideToggle(400);  
 $(this).parents('.header').find('.pull1').toggleClass('is_open');
   });
   $('.pull2').click(function(){
		 $(this).parents('.nav').find('.menu').slideToggle(400);  
		 $(this).parents('.nav').find('.pull2').toggleClass('is_open');
   });
});

$(document).ready(function() {
	$('.basic-usage-demo').fancySelect();

	// Boilerplate
	var repoName = 'fancyselect'

	$.get('https://api.github.com/repos/octopuscreative/' + repoName, function(repo) {
		var el = $('#top').find('.repo');

		el.find('.stars').text(repo.watchers_count);
		el.find('.forks').text(repo.forks_count);
	});

	var menu = $('#top').find('menu');

	function positionMenuArrow() {
		var current = menu.find('.current');

		menu.find('.arrow').css('left', current.offset().left + (current.outerWidth() / 2));
	}

	$(window).on('resize', positionMenuArrow);

	menu.on('click', 'a', function(e) {
		var el = $(this),
			href = el.attr('href'),
			currentSection = $('#main').find('.current');

		e.preventDefault();

		menu.find('.current').removeClass('current');

		el.addClass('current');

		positionMenuArrow();

		if (currentSection.length) {
			currentSection.fadeOut(300).promise().done(function() {
				$(href).addClass('current').fadeIn(300);
			});
		} else {
			$(href).addClass('current').fadeIn(300);
		}
	});

	menu.find('a:first').trigger('click')
});

$(document).ready(function() {
taojet_run();

var tb_search_catalog = 
{
     8789: 
	 {
        title: "Детская одежда",
        items:
		{
                8791:"костюмы",
                8792:"штаны",
                8793:"футболки",
                18789:"для маленьких",
                8798:"для новорожденных"
        }
     },
     001: 
	 {
        title:"Мужская одежда",
        no_link:"true",
        items:
		{
                6849:"обувь",
                8571:"белье",
                8218:"ковбойские сапоги"
        }
    }
}
});
