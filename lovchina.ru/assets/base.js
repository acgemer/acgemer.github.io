$(function(){
	
	/*$("#slider").sliderkit({
		auto:true,
		circular:true,
		start:1,
		panelfx:"sliding"
	});*/
	
	$('#call-me .ico.call-me-ico').click(
		function(){
		
			var call_me_block = $('#call-me');
				
			if(call_me_block.hasClass('open')){
				call_me_block
					.stop(true)
					.animate({right: '-185px'})
					.removeClass('open');
			}else{
				call_me_block
					.stop(true)
					.animate({right: 0})
					.addClass('open');
			}
			
			return false;
		}
	);		
	
	$('#header .login-link').click(
		function(){
			$('#login').fadeToggle();
			return false;
		}
	);	
	$('#login .ico.close-ico').click(
		function(){
			$('#login').hide();
			return false;
		}
	);
	
	
	$('#header .reg-link').click(
		function(){
			var registr_block = $('#registr');
			var bg_modal = $('#bg_modal');
				
			if(registr_block.hasClass('open')){
				registr_block.fadeOut(300).removeClass('open');
				bg_modal.fadeOut(600);
			}else{
				bg_modal.fadeIn(300);
				registr_block
					.css({top: ($(window).scrollTop() + 60) + 'px'})
					.fadeIn(600)
					.addClass('open');
			}
			
			return false;
		}
	);	
	
	$('#registr .ico.close-ico, #bg_modal').click(
		function(){
			var registr_block = $('#registr');
			var bg_modal = $('#bg_modal');

            $regForm.find('input').removeClass('error');
            $regForm.find('alert-messege-block').hide();

            $('#registr')
				.fadeOut(300)
				.removeClass('open');
			$('#bg_modal').fadeOut(600);
				
			return false;
		}
	);
	
	$('#login_modal_form').submit(
		function(){
			$('#login_modal_form .alert-block-modal-login-form').hide();
			var alert_alert = false;
			$(this).find('input.input-field').each(
				function(){
					if($(this).val() == false){
						$(this).parent().find('.alert-block-modal-login-form').show();
						alert_alert = true;
					}
				}
			);
			if(alert_alert) return false;
		}
	);

    var $regForm = $('#registr-form'),
        regtimer;
    $regForm.on('keyup past change', 'input[name="RegistrationForm[username]"]', function() {
        var $t = $(this);
        clearTimeout(regtimer);
        regtimer = setTimeout(function() {
            $.post('/user/registration', $regForm.serialize())
                .always(function(data) {
                    var j = $.parseJSON(data);
                    if(j[0]['RegistrationForm_username']) {
                        $t.parent().parent().find('.alert-messege-block').removeClass('green').text(j[0]['RegistrationForm_username']).show();
                    } else {
                        $t.parent().parent().find('.alert-messege-block').text('Логин свободен').addClass('green').show();
                    }
                });
        }, 2000);
    });
    $regForm.on('keyup past change', 'input[name="RegistrationForm[verifyPassword]"]', function() {
        var $t = $(this);
        clearTimeout(regtimer);
        regtimer = setTimeout(function() {
            if($t.val() != $regForm.find('input[name="RegistrationForm[password]"]').val()) {
                $t.parent().parent().find('.alert-messege-block').removeClass('green').text('Пароли не совпадают').show();
            } else {
                $t.parent().parent().find('.alert-messege-block').text('Ок').addClass('green').show();
            }
        }, 2000);
    });

    $regForm.submit(function(e) {
        e.preventDefault();
        $.post('/user/registration', $regForm.serialize())
            .always(function(data) {
                $regForm.find('input').removeClass('error');
                $regForm.find('alert-messege-block').hide();
                if(data == 'ok') {
                    $('#registr')
                        .fadeOut(300)
                        .removeClass('open');
                    $('#bg_modal').fadeOut(600);
                    msg.show('Вы зарегистрированны, проверьте вашу почту');
                    setTimeout(function(){ location.href=location.href; }, 2000);
                } else {
                    var j = $.parseJSON(data);
                    $.each(j[0], function(index, value) {
                        var i = index.split('_');
                        $('input[name="'+i[0]+'['+i[1]+']"]').addClass('error')
                            .parent().parent().find('.alert-messege-block').removeClass('green').text(value).show();
                    });
                    $.each(j[1], function(index, value) {
                        var i = index.split('_');
                        $('input[name="'+i[0]+'['+i[1]+']"]').addClass('error')
                            .parent().parent().find('.alert-messege-block').removeClass('green').text(value).show();
                    });
                }
            });

        return false;
    });
	
	
	var PSEVDO_RADIO = {
		init: function(){
			if($('input[type=radio]').is('.my-psevdo-radio-box')) PSEVDO_RADIO.start();
		},
		start: function(){
			
			$('input.my-psevdo-radio-box[type=radio]').each(
				function(){
					var mpr_class = $(this).attr('data-class');
					var mpr_style = $(this).attr('data-style');
					var mpr_name = $(this).attr('name');
					var mpr_cheked = $(this).prop('checked');
					
					$(this)
						.hide()
						.wrap('<div class="my-psevdo-radio-block'
							+(mpr_class ? ' '+mpr_class : '')
							+(mpr_cheked ? ' active' : '')+'" '
							+(mpr_style ? ' style="'+mpr_style+'"' : '')
							+'></div>')
						.after('<a href="#" class="psevdo-radio" data-name="'+mpr_name+'"></a>');
				}
			);
								
			PSEVDO_RADIO.psevdo_radio();
		},
		psevdo_radio: function(){
			$(document).on('click', '.my-psevdo-radio-block .psevdo-radio',
				function(){
					var active_radio = $(this);
					if(active_radio.hasClass('active')) return false;
					PSEVDO_RADIO.psevdo_radio_active(active_radio);
					
					return false;
				}
			);
		},
		psevdo_radio_active: function(active_radio){
			var data_name = active_radio.attr('data-name');
			if(data_name){
				$('.my-psevdo-radio-block input[type=radio][name='+data_name+']:checked').each(
					function(){
						$(this).prop('checked', '');
						if($(this).hasClass('my-psevdo-radio-box')){
							$(this)
								.parents('.my-psevdo-radio-block:first')
								.removeClass('active');
						}
					}
				);
			}
			
			var radio_block = active_radio.parents('.my-psevdo-radio-block:first');
			radio_block.addClass('active');
			radio_block.find('input[type=radio]').prop('checked', 'checked');
		}
	};
	
	var PSEVDO_CHECKBOX = {
		init: function(){
			if($('input[type=checkbox]').is('.my-psevdo-checkbox')) PSEVDO_CHECKBOX.start();
		},
		start: function(){
			
			$('input.my-psevdo-checkbox[type=checkbox]').each(
				function(){
					var mpcb_class = $(this).attr('data-class');
					var mpcb_style = $(this).attr('data-style');
					var mpcb_name = $(this).attr('name');
					var mpcb_cheked = $(this).prop('checked');
					
					$(this)
						.hide()
						.wrap('<div class="my-psevdo-checkbox-block'
							+(mpcb_class ? ' '+mpcb_class : '')
							+(mpcb_cheked ? ' active' : '')+'" '
							+(mpcb_style ? ' style="'+mpcb_style+'"' : '')
							+'></div>')
						.after('<a href="#" class="psevdo-checkbox" data-name="'+mpcb_name+'"></a>');
				}
			);
								
			PSEVDO_CHECKBOX.psevdo_checkbox();
		},
		psevdo_checkbox: function(){
			$(document).on('click', '.my-psevdo-checkbox-block .psevdo-checkbox',
				function(){
					var active_psevdo_checkbox = $(this);
					var parent_psevdo_checkbox = $(this).parents('.my-psevdo-checkbox-block:first');
					var active_checkbox = parent_psevdo_checkbox.find('input[type=checkbox]');
					
					if(active_checkbox.prop('checked')){
						parent_psevdo_checkbox.removeClass('active');
							
						active_checkbox.prop('checked', '');
					}else{
						parent_psevdo_checkbox.addClass('active');
							
						active_checkbox.prop('checked', 'checked');
					}
					
					return false;
				}
			);
		}
	};

	PSEVDO_CHECKBOX.init();
    PSEVDO_RADIO.init();
	
	

//    $(".box_skitter_large").skitter({ // http://thiagosf.net/projects/jquery/skitter/
//                        animation: 'random',
//                        interval: 3000,
// 			dots: true,
//                        navigation: false,
//                        numbers_align: "center",
//                        numbers: false,
// 			progressbar: false,
//                        label: false,
//                        animateNumberActive: { backgroundColor:'#E7B45B', color:'#E7B45B' },
//                        animateNumberOut:    { backgroundColor:'#A3A3A3', color:'#A3A3A3' },
//                        animateNumberOver:   { backgroundColor:'#E7B45B', color:'#E7B45B' }
//		});
//
    var imgCount = 0;
    $('#main.page img').each(function(){
        if (!$(this).parent('a').length || ($(this).parent('a').length && $(this).parent('a').attr('href') == $(this).attr('src'))) {
            imgCount++;
        }
    });
    $('#main.page img').each(function(){
		var class_img = $(this).attr('style');
        var fb = (!$(this).parent('a').length || ($(this).parent('a').length && $(this).parent('a').attr('href') == $(this).attr('src')));
        $(this).attr('style', '').wrap('<a href="'+(!fb?$(this).parents('a').attr('href'):$(this).attr('src'))+'"'+(imgCount>1?' rel="fg"':'')+' class="fancyb" style="'+class_img+'">');
        var title = $(this).attr('title');
        var desc = $(this).attr('longdesc');
		
		if(title){
			$(this).parent().append('<span class="product-desc"'+(desc ? 'title="'+desc+'"' : '')+'>'+title+'</a>');
		}
		
    });
//    console.log($.fn.fancybox);
    if ($.fancybox) {
        $('a.fancyb', $('#main')).fancybox({ // http://fancyapps.com/fancybox/
            helpers : {
                title : {
                    type : 'inside'
                }
            },
            beforeShow: function() {
                this.title = function(){
                                    var img_fb = $(this).find('img');
                                    return (img_fb.attr('title') ? '<strong>'+img_fb.attr('title')+'</strong>' : '')+(img_fb.attr('longdesc') ? img_fb.attr('longdesc') : '');
                                }
            }
        });
    }

    // feedback
    $('a[href="#form-feedback"]').click(function(){
        if ($('#form-feedback').css('display') == 'block') {
            $('#form-feedback').fadeOut('fast');
        } else {
            $('#form-feedback').css({
                top: (parseInt($(this).offset().top + ($(this).height() / 2)) - 282) + 'px'
            }).fadeIn('fast');
        }
        return false;
    });
    $("#form_contact").submit(function(e){
        var hasError = false, ajax = true;
        $(this).find('input.required, textarea.required').each(function(){
            $(this).removeClass('error');
            if ($(this).val() == '') {
                $(this).addClass('error');
                hasError = true;
            }
        });
        if (hasError) {
            msg.show('Заполните все поля формы!');
            return false;
        } else if (ajax) {
            e.preventDefault();
            $.post($(this).attr('action'), $(this).serialize(), function(data){
                if(data.success) {
                    msg.show('Сообщение отправлено');
                    setTimeout(function() {
                        location.href = location.href;
                    }, 1000);
                } else {
                    if(!data.captcha){
                        $('#captcha-form').addClass('error');
                    }
                }
            }, 'json');
            return false;
        }
    });
    
    // Cart dropdown
    $('.topmenu .cart > span').click(function(){
        if ($(this).parent().hasClass('open')) {
            $(this).parent().removeClass('open');
            
        } else {
            $(this).parent().addClass('open');
            $('.topmenu .cart > .dropdown').css({left: parseInt($(this).offset().left) + 'px'});
        }
    });
    
    msg.init();
    
    $('.qnt > .qnt_input').click(function(){ this.select() });
    $('.qnt > .plus').click(function(){
        var val = parseInt($(this).prev().val())+1;  
        $(this).prev().val(val);
    });
    $('.qnt > .minus').click(function(){
        var val = parseInt($(this).next().val())-1;
        $(this).next().val(val > 0 ? val : 1);
    });
    
    $('.product .img > a, .product h2 > a').click(function(){
        var link = $(this).attr('href');
        $('#modalwrap').fadeIn('fast');
        $('#modal-card').css('top', ($(window).scrollTop() + 50) + 'px');
        $('<div>').load(link + ' .product-view', function(){
            $('#modal-card').html($(this).html());
            $('#modal-card').fadeIn('fast');
            $('#modal-card a.pfb').fancybox({helpers:{title:{type:'inside'}}});
        });
        return false;
    });
    
    $('#getCart').click(function(){
        if (!$.cookie('cart')) {
            msg.show('У Вас нет товаров в корзине');
        } else {
            var link = $(this).attr('href');
            $('#modal-msg, #modal-card').css('display','none');
            $('#modalwrap').fadeIn('fast');
            $('#modal-card').css('top', ($(window).scrollTop() + 50) + 'px');
            $('<div>').load(link + ' .cart-view', function(){
                $('#modal-card').html($(this).html());
                $('#modal-card').fadeIn('fast');
            });
        }
        return false;
    });
    $('a[href="/order"]').click(function(){
        if ($('#totalallcart').text() == '0') {
            msg.show('У Вас нет товаров в корзине');
            return false;
        }
    });
    
    $('.cart-view .qnt > .plus, .cart-view .qnt > .minus').click(changeCount);
    $('.cart-view .qnt > .qnt_input, #ordering .qnt > .qnt_input').bind('past keyup', changeCount);
    
    $('.delete').click(function(){
        var id = parseInt($(this).parents('div.cart-block').attr('id').replace('row',''));
        $.ajax({
            type: 'POST',
            url: '/site/cartDelete',
            data: {id: id},
            success: function(result){
                $('#row'+id).remove();
                recalcCart(jQuery.parseJSON(result));
                $('.delivery select[name="delivery"]').change();
            }
         });
    });

    $('#delivery .m-p-p-order').click(function() {
        var $t= $(this);
        if($t.is('.region')) return;
        $('.region').hide();

        var $a = $t.parent().find('.region').show().eq(0).find('.my-psevdo-radio-block .psevdo-radio'),
            $cart = $('.f-o-c-cart .total'),
            $box = $a.prev();
        PSEVDO_RADIO.psevdo_radio_active($a);
        //console.log('mpporder data-limit ' + $box.attr('data-limit') + ' price ' + $box.attr('data-price') + ' total ' + cartTotal);
        if(cartTotal && cartTotal<$box.attr('data-limit'))
            $cart.text(parseInt(cartTotal,10)+parseInt($box.attr('data-price'),10));
        else
            $cart.text(cartTotal);
    })
        .eq(0).trigger('click');
    $('#delivery .region').click(function() {
        var $t= $(this),
            $a = $t.find('.my-psevdo-radio-block .my-psevdo-radio-box'),
            $cart = $('.f-o-c-cart .total');

        //console.log('region data-limit ' + $a.attr('data-limit') + ' price ' + $a.attr('data-price') + ' total ' + cartTotal);
        if(cartTotal && cartTotal<$a.attr('data-limit'))
            $cart.text(parseInt(cartTotal,10)+parseInt($a.attr('data-price'),10));
        else
            $cart.text(cartTotal);
    });

    $('.shop-item .qnt').each( function(){
		var $container = $(this);
		var $incButton = $container.find('.quantity_plus'); 
		var $decButton = $container.find('.quantity_minus');
		var $quantity = $container.find('.qnt_input');
		$incButton.on('click',function(){ $quantity.val( parseInt( $quantity.val() ) + 1 ); return false;});
		$decButton.on('click',function(){ var amount = parseInt( $quantity.val() ); if( amount - 1 > 0 ){ $quantity.val( amount - 1 ); } return false;});
	} );

    $('.tocart').click(function(){
        var id = parseInt($(this).attr('id').replace('tocart',''));
        var amount = 1;
        if ($("#row"+id).find('.qnt .qnt_input').length) {
            amount = parseInt($("#row"+id).find('.qnt .qnt_input').val());
            amount = amount > 1 ? amount : 1;
            $("#row"+id).find('.qnt .qnt_input').val(amount);
        }
        var color = $('input[type=radio][name=color]:checked').val();
        color = color ? color : '';
        $.ajax({
            type: 'POST',
            url: '/site/cartAdd',
            data: { id: id, amount: amount, color: color },
            success: function(result){
                resp = jQuery.parseJSON(result);
                recalcCart(resp);
                msg.show(resp['result']);
            }
        });
    });
    $('a.order-detail').click(function () {
        $.ajax({
            type: 'GET',
            url: $(this).attr('href'),
            success: function (result) {
                $('#modal_inner').html(result);
                $('#modal_windows').fadeIn();
            }
        });
        return false;
    });
    $('#modal_windows > .m-w-c-l-i').click(function () {
        $('#modal_windows').fadeOut();
    });
});

function changeCount() {
    var id = parseInt($(this).parents('div.cart-block').attr('id').replace('row',''));
    var count = parseInt($(this).parent().find('.qnt_input').val());
    if (count) {
        $.post('/site/cartChangeCount', {id: id, col: count}, function(data){
            recalcCart(data, id);
        }, 'json');
    }
}

function clearcart() {
    $.cookie('cart', null, {path: '/', expires: 31});
    $.cookie('cost', 0, {path: '/', expires: 31});
    recalcCart({cost: 0, count: 0});
}

var cartTotal = $('.f-o-c-cart .total').text().replace(' ','');
//$('#items_cart').text(plural_str($('#items_cart').text(),'{n} товар','{n} товара','{n} товаров'));
$('.count-in-cart').text($('.count-in-cart:eq(0)').text());
function recalcCart(data, id) {
    //    if ($('.cart-view').length) {
    if (id && data[id]) $('#row' + id + ' .price').text(data[id]);


    var $delivery = $('.my-psevdo-radio-block.active').eq(1).find('.my-psevdo-radio-box'),
        $cart = $('.f-o-c-cart .total');
    $cart.text(data['cost']);
    cartTotal = data['cost'];
    //console.log('data-limit ' + $delivery.attr('data-limit') + ' price ' + $delivery.attr('data-price') + ' total ' + cartTotal);
    if(cartTotal && cartTotal<$delivery.attr('data-limit'))
        $cart.text(parseInt(cartTotal,10)+parseInt($delivery.attr('data-price'),10));
    else
        $cart.text(cartTotal);

    //$('.cart-view .total').text('Итого: '+data['cost']+' р.');
//    }
    if (typeof data['count'] != 'undefined') {
        //$('#items_cart').text(plural_str(data['count'],'{n} товар','{n} товара','{n} товаров'));
        $('.count-in-cart').text(data['count']);
    }
    $('#totalallcart').text(data['cost']/* + ' р.'*/);

    if( (typeof data['count'] != 'undefined' && data['count'] == 0 ) 
    	|| 
    	( typeof data['count'] == 'undefined' && data['cost'] == 0 )
	){
        $('#ordering form').empty().html('<h2>Корзина пуста</h2>');
    }
    recalcDelivery();
    recalcDiscount(data['cost']);
}

function recalcDelivery() {
    var $region = $('#delivery .region');

    $region.each(function() {
        var $t = $(this),
            $r = $t.find('.my-psevdo-radio-box'),
            $p = $t.find('.price');

        if(cartTotal<$r.attr('data-limit'))
            $p.html(' - '+ $r.attr('data-price') +' <span class="valuta">руб</span>');
        else
            $p.html(' - бесплатно');
    });

}

function recalcDiscount(total) {
    var block = $('.skidka-messege-block');
    var current = { limit: 0, discount: 0 };
    var next =    { limit: 0, discount: 0 };
    if (block.length) {
        for (limit in discounts) {
            if (limit <= total) {
                current.limit = limit;
                current.discount = discounts[limit];
            } else if (next.limit == 0) {
                next.limit = limit;
                next.discount = discounts[limit];
            }
        }
        if (current.discount) {
            var t = Math.round(total - (total * (current.discount / 100)));
            $('.f-o-c-cart .total').text(t);
            cartTotal = t;
            $('.current_skidka_wrapper').show();
            $('.current_skidka_wrapper .current_skidka_procent').text(current.discount);
        } else {
        	$('.current_skidka_wrapper').hide();
        }
        if (next.discount) {
            block.find('.skidka_procent').text(next.discount);
            block.find('.s-n-h-p-skidka').text(next.limit - total);
			
			if(block.hasClass('discount-cart-bolock')){
				block.removeAttr('style');
			}else{
				block.fadeIn(1000);
			}
        } else {
            block.fadeOut();
        }
    }
}


var msg = {
    html: '<div id="modal-wrap"></div><div id="modal-msg"><a href="#" class="close" title="Закрыть">&times;</a><div class="content"></div></div>',
    show: function(text, closeTimeout) {
        $('#modal-msg').css('top', ($(window).scrollTop() + 200) + 'px');
        if (typeof closeTimeout == "undefined") {
            closeTimeout = 1000;
        }
        $('#modal-wrap').fadeIn('fast', function(){
            $('#modal-msg').html(text);
            $('#modal-msg').fadeIn('fast', function(){ 
                if (closeTimeout !== false) {
                    setTimeout(function(){msg.close()}, closeTimeout);
                }
            });
        });
    },
    close: function() {
        $('#modal-msg').fadeOut('fast', function(){
            $('#modal-wrap').fadeOut('fast');
        });
    },
    init: function() {
        if ($('#modal-msg, #modal-wrap').length == 0) {
            $('body').append(this.html);
        }
        $('#modal-wrap').click(function(){ msg.close() });
    }
};

function fileUpload(form, action_url, div_id) {
    if ($(form).find('input[name=fio]').val() == '') {
        $(form).find('input[name=fio]').focus();
        return false;
    }
    if ($(form).find('textarea[name=comment]').val() == '') {
        $(form).find('textarea[name=comment]').focus();
        return false;
    }
    
    // Create the iframe...
    var iframe = document.createElement("iframe");
    iframe.setAttribute("id", "upload_iframe");
    iframe.setAttribute("name", "upload_iframe");
    iframe.setAttribute("width", "0");
    iframe.setAttribute("height", "0");
    iframe.setAttribute("border", "0");
    iframe.setAttribute("style", "width: 0; height: 0; border: none;");
 
    // Add to document...
    form.parentNode.appendChild(iframe);
    window.frames['upload_iframe'].name = "upload_iframe";
 
    iframeId = document.getElementById("upload_iframe");
 
    // Add event...
    var eventHandler = function () {
 
            if (iframeId.detachEvent) iframeId.detachEvent("onload", eventHandler);
            else iframeId.removeEventListener("load", eventHandler, false);
 
            // Message from server...
            var content = '';
            if (iframeId.contentDocument) {
                content = iframeId.contentDocument.body.innerHTML;
            } else if (iframeId.contentWindow) {
                content = iframeId.contentWindow.document.body.innerHTML;
            } else if (iframeId.document) {
                content = iframeId.document.body.innerHTML;
            }
            
            document.getElementById(div_id).innerHTML = content;
 
            // Del the iframe...
            setTimeout('iframeId.parentNode.removeChild(iframeId)', 250);
            
            $('#form-feedback').delay(2000).fadeOut('fast');
        }
 
    if (iframeId.addEventListener) iframeId.addEventListener("load", eventHandler, true);
    if (iframeId.attachEvent) iframeId.attachEvent("onload", eventHandler);
 
    // Set properties of form...
    form.setAttribute("target", "upload_iframe");
    form.setAttribute("action", action_url);
    form.setAttribute("method", "post");
    form.setAttribute("enctype", "multipart/form-data");
    form.setAttribute("encoding", "multipart/form-data");
 
    // Submit the form...
    form.submit();
 
    document.getElementById(div_id).innerHTML = "Загрузка...";
    form.style.display = 'none';
}

function plural_str(i, str1, str2, str3) {
    function plural (a){
        if ( a % 10 == 1 && a % 100 != 11 ) return 0
        else if ( a % 10 >= 2 && a % 10 <= 4 && ( a % 100 < 10 || a % 100 >= 20)) return 1
        else return 2;
    }
    switch (plural(i)) {
        case 0:return str1.replace('{n}',i);
        case 1:return str2.replace('{n}',i);
        default:return str3.replace('{n}',i);
    }
}
