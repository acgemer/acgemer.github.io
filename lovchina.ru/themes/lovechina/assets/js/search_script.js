if (navigator.userAgent.indexOf("Safari") > 0)
{
    isSafari = true;
    isMoz = false;
    isIE = false;
}
else if (navigator.product == "Gecko")
{
    isSafari = false;
    isMoz = true;
    isIE = false;
}
else
{
    isSafari = false;
    isMoz = false;
    isIE = true;
}

/*
 liveUpdater returns the live update function to use
 uriFunc: The function to generate the uri
 postFunc: <optional> Function to run after processing is complete
 preFunc: <option> Function to run before processing starts
 */
function liveUpdater(uriFunc, postFunc, preFunc)
{
    if(!postFunc) postFunc = function () {};
    if(!preFunc) preFunc = function () {};

    return createLiveUpdaterFunction(uriFunc, postFunc, preFunc);
}

function createLiveUpdaterFunction(uriFunc, postFunc, preFunc)
{
    var request = false;
    if (window.XMLHttpRequest) {
        request = new XMLHttpRequest();
    }

    function update()
    {
        if(request && request.readyState < 4)
            request.abort();


        if(!window.XMLHttpRequest)
            request = new ActiveXObject("Microsoft.XMLHTTP");

        preFunc();
        request.onreadystatechange = processRequestChange;
        if(("withCredentials" in request) && (!request.withCredentials))
        {
            request.withCredentials = true;
        }
        request.open("GET", uriFunc());
        request.send(null);

        return true;
    }

    function processRequestChange()
    {
        if(request.readyState == 4)
        {
            if (request.status == 200) {
                var body = JSON.parse(request.responseText);
                if(body.length > 0)
                {
                    var popupHTML = "<ul>";
                    for(var i=0;i<body.length;i++)
                    {
                        popupHTML += "<li>" + body[i] + "</li>"
                    }
                    var tj_info = '<div class="tjnfo"><a href="http://www.taojet.ru" target="_blank">поиск TaoJet.ru</a></div>';
                    popupHTML += "</ul>"+tj_info;
                    document.getElementById("autocomplete-popup").innerHTML = popupHTML;
                }
                postFunc();
            }
        }
        else
        {
            document.getElementById("autocomplete-popup").innerHTML = "";
        }
    }
    return update;
}

function autocomplete(id, popupId, uri)
{
    var inputField = document.getElementById(id);
    var popup = document.getElementById(popupId);
    var options = new Array();
    var current = 0;
    var originalPopupTop = popup.offsetTop;

    function constructUri()
    {
        var separator = "?";
        if(uri.indexOf("?") >= 0)
            separator = "&";
        return uri + separator + "query_text=" + encodeURIComponent(inputField.value);
    }

    function hidePopup()
    {
        popup.style.visibility = 'hidden';
    }

    function handlePopupOver()
    {
        removeListener(inputField, 'blur', hidePopup);
    }

    function handlePopupOut()
    {
        if(popup.style.visibility == 'visible')
        {
            addListener(inputField, 'blur', hidePopup);
        }
    }

    function handleClick(e)
    {
        inputField.value = eventElement(e).innerHTML;
        popup.style.visibility = 'hidden';
        inputField.focus();
    }

    function handleOver(e)
    {   if (current >= 0) options[current].className = '';
        current = eventElement(e).index;
        options[current].className = 'selected';
    }

    function post()
    {
        current = -1;
        options = popup.getElementsByTagName("li");
        if((options.length > 1)
            || (options.length == 1
            && options[0].innerHTML != inputField.value))
        {
            setPopupStyles();
            for(var i = 0; i < options.length; i++)
            {
                options[i].index = i;
                addOptionHandlers(options[i]);
            }
           /* options[0].className = 'selected';   */
        }
        else
        {
            popup.style.visibility = 'hidden';
        }
    }

    function setPopupStyles()
    {
        var maxHeight
        if(isIE)
        {
            maxHeight = 200;
            popup.style.left = '0px';
            popup.style.top = (originalPopupTop + inputField.offsetHeight) + 'px';
        }
        else
        {
            maxHeight = window.outerHeight/3;
        }
        if(popup.offsetHeight < maxHeight)
        {
            popup.style.overflow = 'hidden';
        }
        else if(isMoz)
        {
            popup.style.maxHeight = maxHeight + 'px';
            popup.style.overflow = '-moz-scrollbars-vertical';
        }
        else
        {
            popup.style.height = maxHeight + 'px';
            popup.style.overflowY = 'auto';
        }
        popup.scrollTop = 0;
        popup.style.visibility = 'visible';
    }

    function addOptionHandlers(option)
    {
        addListener(option, "click", handleClick);
        addListener(option, "mouseover", handleOver);
    }

    var updater = liveUpdater(constructUri, post);
    var timeout = false;

    function taojet_start(e) {
        if (timeout){
            window.clearTimeout(timeout);
        }
        //up arrow
        if(e.keyCode == 38)
        {
            if(current > 0)
            {
                options[current].className = '';
                current--;
                options[current].className = 'selected';
                options[current].scrollIntoView(false);
                inputField.value = options[current].innerHTML;
            }
        }
        //down arrow
        else if(e.keyCode == 40)
        {
            if(current < options.length - 1)
            {
                if (current >= 0) options[current].className = '';
                current++;
                options[current].className = 'selected';
                options[current].scrollIntoView(false);
                inputField.value = options[current].innerHTML;
            }
        }
        //enter
        else if(e.keyCode == 13)
        {
            if (popup.style.visibility == 'visible'){
                if (current >= 0) inputField.value = options[current].innerHTML;
                popup.style.visibility = 'hidden';
                inputField.focus();
            }
            taojet_go();
            if(isIE)
            {
                event.returnValue = false;
            }
            else
            {
                e.preventDefault();
            }
        }
        // escape
        else if(e.keyCode == 27){
            popup.style.visibility = 'hidden';
            inputField.focus();
        }
        else
        {
            timeout = window.setTimeout(updater, 300);
        }
    }

    addKeyListener(inputField, taojet_start);
    addListener(popup, 'mouseover', handlePopupOver);
    addListener(popup, 'mouseout', handlePopupOut);
}

/* Functions to handle browser incompatibilites */
function eventElement(event)
{
    if(isMoz)
    {
        return event.currentTarget;
    }
    else
    {
        return event.srcElement;
    }
}

function addKeyListener(element, listener)
{
    if (isSafari)
        element.addEventListener("keydown",listener,false);
    else if (isMoz)
        element.addEventListener("keypress",listener,false);
    else
        element.attachEvent("onkeydown",listener);
}

function addListener(element, type, listener)
{
    if(element.addEventListener)
    {
        element.addEventListener(type, listener, false);
    }
    else
    {
        element.attachEvent('on' + type, listener);
    }
}

function removeListener(element, type, listener)
{
    if(element.removeEventListener)
    {
        element.removeEventListener(type, listener, false);
    }
    else
    {
        element.detachEvent('on' + type, listener);
    }
}

/* ================================================================================ */
/* ================================================================================ */
/* ================================================================================ */

function taojet_ajax( url, options ){

    if ( typeof url === "object" ) {
        options = url;
        url = undefined;
    }

    options = options || {};

    options.type = options.type || 'get';
    options.dataType = options.dataType || 'html';
    options.async = options.async === undefined ? true : options.async;

    var data = null;

    if ( options.data ) {
        if ( typeof options.data == "object" ) {
            for( var i in options.data ) {
                data = ( ( data == null ) ? "" : data + "&" ) + ( i + "=" + options.data[ i ] );
            }
        } else {
            data = options.data;
        }
    }

    url = url || options.url;

    url = ( url + "" ).replace( /#.*$/, "" );

    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"),
        perhapsJSON, textStatus, error = false;

    xhr.onload = function() {
        if ( xhr.readyState == 4 ) {
            //xhr.onreadystatechange = null;
            if ( xhr.status >= 200 && xhr.status < 300 || xhr.status === 304 ) {
                perhapsJSON = xhr.responseText;
                textStatus = xhr.statusText || "";
                try {
                    if ( options.dataType == 'json' ) {
                        if ( window.JSON && JSON.parse ) {
                            perhapsJSON = JSON.parse( perhapsJSON );
                        } else {
                            perhapsJSON = (new Function( "return " + perhapsJSON ))();
                        }
                    }
                } catch( _ ) {
                    error = true;
                    if ( options.error ) {
                        options.error.call( xhr, xhr, textStatus );
                    }
                }
                if ( !error ) {
                    if ( options.success ) {
                        options.success.call( xhr, perhapsJSON, textStatus, xhr );
                    }
                }
                if ( options.complete ) {
                    options.complete.call( xhr, xhr, textStatus );
                }
            } else {
                if ( options.error ) {
                    options.error.call( xhr, xhr, xhr.statusText || "" );
                }
            }
            xhr = null;
        }
    }

    xhr.open( options.type, url, options.async );

    try {
        xhr.setRequestHeader( "X-Requested-With", "XMLHttpRequest" );
        if ( options.type == "post" ) {
            xhr.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
        }
    } catch( _ ) {}
    if(("withCredentials" in xhr) && (!xhr.withCredentials))
    {
        xhr.withCredentials = true;
        xhr.send( data );
    }
    return xhr;
}

/* activate search request */
function taojet_go()
{
    document.forms["taojet_search_form"].submit();
}
function taojet_put_text(obj)
{
    document.getElementById("taojet_query_text").value = obj.textContent;
    taojet_close_lightbox();
    return false;
}
function taojet_check_enter_key(event)
{
    if (event.keyCode == 13)
    {
        taojet_go();
    }
}

/* select category */
function taojet_select_category(category, parent_title)
{
    var selected_category = document.getElementById("taojet_selected_category");
    var title = category.innerHTML;
    if (parent_title!=undefined){
        title = parent_title + ": "+ title;
    }

    selected_category.innerHTML = title;
    document.getElementsByName("taobao_id_of_selected_category")[0].setAttribute("value", category.getAttribute("taobao_id"));

    taojet_close_lightbox();
}

function taojet_close_lightbox(){
    taojet_close_dimmer();

    var lightbox = document.getElementById("taojet_lightbox");
    var taojet_categories = document.getElementById("taojet_categories");
    var taojet_queries_info = document.getElementById("taojet_queries_info");

    lightbox.style.display = 'none';
    taojet_categories.style.display = 'none';
    taojet_queries_info.style.display = 'none';

    var param_panel = document.getElementById("taojet_search_params");
    if (param_panel){
        param_panel.setAttribute("style", "display:none");
    }
}

function taojet_dimmer_listener(e){
    if(e.keyCode == 27){
        taojet_close_lightbox();
    }
}

function taojet_open_dimmer(){
    var dimmer = document.createElement("div");
    dimmer.setAttribute("id", "taojet_dimmer");
    /* close popup */
    dimmer.onclick = taojet_close_lightbox;

    document.body.appendChild(dimmer);
    addKeyListener(document.body, taojet_dimmer_listener);
    return dimmer;
}

function taojet_open_invisible_dimmer(){
    var dimmer = taojet_open_dimmer();
    dimmer.setAttribute("class", "invisible");
};

function taojet_close_dimmer(){
    var dimmer = document.getElementById("taojet_dimmer");
    if (dimmer!=undefined){
        document.body.removeChild(dimmer);
    }
}

function taojet_open_lightbox_with(elem)
{
    var lightbox = document.getElementById("taojet_lightbox");
    taojet_open_dimmer();

    elem.style.display = 'block';
    lightbox.style.display = 'block';
    lightbox.setAttribute("class", elem.id+" shadow");

    return false;
}

function taojet_show_search_params(){
    taojet_open_invisible_dimmer();
    document.getElementById("taojet_search_params").setAttribute("style", "display:block");
}


function taojet_tab_switch(new_tab, new_content) {
    document.getElementById('taojet_top_10_content').style.display = 'none';
    document.getElementById('taojet_queries_history_content').style.display = 'none';
    document.getElementById(new_content).style.display = 'block';

    document.getElementById('taojet_top_10_tab').className = '';
    document.getElementById('taojet_queries_history_tab').className = '';
    document.getElementById(new_tab).className = 'active';
}

function taojet_dateToYMD(date)
{
    var d = date.getDate();
    var m = date.getMonth()+1;
    var y = date.getFullYear();
    var h = date.getHours();
    var mm = date.getMinutes();
    return '' + (d<=9?'0'+d:d) +'.'+ (m<=9?'0'+m:m) +'.'+ y + ' ' + (h<=9?'0'+h:h) + ':' + (mm<=9?'0'+mm:mm);
}

function set_user_query_page_link(page_number){
    try{
        var old_link = document.querySelector("div[id='taojet_pagination']").querySelector("a[class='active']");
        old_link.setAttribute("class","");
    }catch(e){}

    var link = document.querySelector("a[id='tjqhpage"+page_number+"']");
    if (link!=undefined){
        link.setAttribute("class","active");
    }
}

function taojet_get_user_queries_from_page(page_number) {
    var query_history = document.getElementById("taojet_query_history");
    set_user_query_page_link(page_number);

    taojet_ajax({
        url: "http://search.taojet.com/api/queries?page=" + page_number,
        type: "get",
        dataType: "html",
        success: function( data, textStatus, xhr ) {
            queries = JSON.parse(data);
            var query_history_html = "";
            for (var key in queries) {
                var created_at = queries[key].created_at;
                created_at = created_at.replace(/-/g," ");
                var time_text = new Date(created_at);
                time_text = taojet_dateToYMD(time_text);
                query_history_html += "<li><a href='#' onclick='taojet_put_text(this);return false;'>" +
                    queries[key].ru_text + "</a><small>" + time_text + "</small></li>";
            }
            query_history.innerHTML = query_history_html;
        },
        complete: function( xhr, textStatus ) {
        },
        error: function( xhr, textStatus ) {
        }
    });
}

var tb_search_catalog = {
	8789: {
		title: "Детская одежда и обувь",
		items:  {
			001: {
				title: "Костюмы",
				no_link: "true",
				items: {
					8791: "Костюмы",
					8807: "Костюмы для детей и их родителей" ,
					8836: "Танцевальные костюмы"
				}
			},
			0001: {
				title: "Аксессуары",
				no_link: "true",
				items: {
					8845: "Заколки для волос",
					8869: "Бижутерия",
					8874: "Пояса",
					8877: "Галстуки",
					8884: "Прочие аксессуары"
				}
			},
			002: {
				title: "Тёплая одежда",
				no_link: "true",
				items: {
					8815: "Куртки и толстовки",
					8808: "Тёплая одежда",
					8862: "Плащи и накидки",
					8822: "Шапки, шарфы"
				}
			},
			003: {
				title: "Штаны, шорты",
				no_link: "true",
				items: {
					8792: "Штаны и шорты",
					8804: "Джинсы",
					8818: "Шаровары",
					8846: "Комбинезоны"
				}
			},
			004: {
				title: "Обувь",
				no_link: "true",
				items: {
					8794: "Кроссовки, кеды",
					8801: "Сандалии",
					8831: "Обувь из кожи",
					8841: "Обувь (разное)",
					8847: "Шлёпанцы",
					8870: "Танцевальная обувь",
					8861: "Зимняя обувь",
					8866: "Обувь для дождя"
				}
			},
			005: {
				title: "Футболки, рубашки, платья",
				no_link: "true",
				items: {
					8793: "Футболки",
					8811: "Рубашки и футболки с длинным рукавом",
					8790: "Платья",
					8806: "Жилеты",
					8820: "Вязаные вещи"
				}
			},
			006: {
				title: "Нижнее бельё",
				no_link: "true",
				items: {
					8850: "Нижнее бельё",
					8855: "Носки",
					8832: "Купальники"
				}
			}
		}
	},
	6850: {
		title: "Женская одежда",
		items: {



			001: {
    				title: "Женская обувь",
    			        no_link: "true",
    				items: {
      					7144: "Вся",
      					7147: "Обувь (разное)",
      					7149: "Обувь на платформе",
      					7150: "Открытая обувь на каблуке",
      					7155: "Обувь на низком каблуке",
      					7162: "Шлёпанцы",
      					7187: "Обувь с бахромой",
      					7186: "Ботфорты",
      					7184: "Обувь со шнуровкой",
      					7181: "Высокие сапоги",
      					7179: "В дождь",
      					7178: "Сапоги и полусапожки",
      					7177: "Зимняя обувь",
      					7175: "Обувь на платформе",
      					7173: "Обувь на платформе",
      					7172: "Ботинки и батильоны",
      					7145: "Сабо",
      					7146: "Босоножки"
    				}
  			},
			008: {
				title: "Блузки, футболки",
				no_link: "true",
				items: {
					6852: "Шифоновые блузки",
					6853: "Футболки",
					6857: "Рубашки и блузки",
					6881: "Топики"
				}
			},
			009: {
				title: "Юбки, штаны",
				no_link: "true",
				items: {
					6854: "Юбки",
					6855: "Штаны и шорты",
					6856: "Джинсы",
					6884: "Шаровары",
					6917: "Леггинсы"
				}
			},
			003: {
				title: "Платья",
				no_link: "true",
				items: {
					6858: "Платья из шёлка",
					6883: "Платья из шифона",
					6916: "Кружевные платья",
					6927: "Платья с пышной юбкой",
					6921: "Свадебные платья"
				}
			},
			011: {
				title: "Свитера, толстовки",
				no_link: "true",
				items: {
					6882: "Свитера",
					6919: "Жилеты",
					6925: "Толстовки",
					6926: "Свитера",
					6959: "Кашемировые свитера"
				}
			},
			002: {
				title: "Верхняя одежда",
				no_link: "true",
				items: {
					6903: "Короткие куртки",
					6928: "Ветровки",
					6953: "Пальто",
					6954: "Меховые изделия",
					6940: "Пуховики",
					6945: "Верхняя одежда из шерсти",
					6946: "Верхняя одежда из кожи"
				}
			},
			013: {
				title: "Костюмы",
				no_link: "true",
				items: {
					6905: "Костюмы",
					6908: "Деловые костюмы (юбка)",
					6910: "Деловые костюмы (штаны)",
					6909: "Костюмы для отдыха"
				}
			},
			014: {
				title: "По возрасту и размеру",
				no_link: "true",
				items: {
					6862: "Одежда для женщин среднего возраста",
					6886: "Большие размеры"
				}
			}
		}
	}
}

function taojet_create_catalog_item(item, tb_index, class_name){
    var title = item.title;
    if (item.no_link=="true"){
         var content = "<li"+class_name+"><span>" + title + "</span><ul class='taojet_subcategories'>";
    }else{
         var content = "<li"+class_name+"><span><a href='#' taobao_id='"+tb_index+
                "' onclick='taojet_select_category(this);return false;'>"+title+"</a></span>"+
               "<ul class='taojet_subcategories'>";
    }
    return content;
}

function taojet_create_catalog_sub_item(title, sub_title, sub_index, class_name){
     var content = "<li><a href='#' taobao_id='"+sub_index+
                   "' onclick='taojet_select_category(this,"+ '"'+ title +'"'+");return false;'>"+sub_title+"</a>";
     return content;
}

function taojet_build_catalog_sub_items(elem, title){
    var content = "";
    for (var sub_index in elem.items){
            var sub_el = elem.items[sub_index];
	    if (sub_el.items!=undefined){
                /* трехуровневый каталог */
                is_tjs_multilevel_catalog = true;
                have_sun = true;
                content = content + "<div class='tj_sub_list'>" + taojet_create_catalog_item(sub_el, sub_index, " class='tj_sub_header'");
                content = content + taojet_build_catalog_sub_items(sub_el, title) + "</ul></li></div>";
	    }else{
	        var sub_title = sub_el;
                content = content + taojet_create_catalog_sub_item(title, sub_title, sub_index);
            }
     }
     return content;
}

function taojet_create_search_catalog(){
    try{ tb_search_catalog=tb_search_catalog;
    }catch(e){ tb_search_catalog = tb_default_search_catalog; }

    var list ="<li class='all_taobao_categories'><a href='#' taobao_id='' onclick='taojet_select_category(this);return false;'>Все</a></li>";

    for (var tb_index in tb_search_catalog){
        var title = tb_search_catalog[tb_index].title;

	list = list + taojet_create_catalog_item(tb_search_catalog[tb_index], tb_index, "");

	list = list + taojet_build_catalog_sub_items(tb_search_catalog[tb_index], title);

        list = list + "</ul></li>";
    }
    document.getElementById("taojet_categories").innerHTML = list;
    if (is_tjs_multilevel_catalog){
        document.getElementById("taojet_categories").setAttribute("class", "tjs_multilevel_catalog");
    }
}

function taojet_run(){
    /* insert search box (input + button + categories + ...) on page load */
    var d = document.getElementById("taojet_search");
    d.innerHTML = "<div class=\"taojet_search_box\">\n  <div id=\"taojet_text_search\">\n      <form id=\"taojet_search_form\" action=\"http://search.taojet.com/api/search\" accept-charset=\"UTF-8\" method=\"post\" target=\"_blank\">\n\n        <a href=\"http://taojet.ru/\" id=\"taojet_use_image_search\" class=\"tj_top_link tj_by_photo_search_link\" target=\"_blank\">поиск по фото<\/a>\n\n        <input id=\"taojet_query_text\" class=\'taojet_query_text\' type=\'text\' name=\'query_text\' autocomplete=\"off\" placeholder=\"найти на Таобао...\">\n\n        <div id=\"autocomplete-popup\" class=\"autocomplete shadow\"><\/div>\n\n        <a class=\'taojet_btn_search\' onclick=\'taojet_go();return false;\' href=\'#\'>Искать<\/a>\n\n        <div class=\"taojet_category_box\">\n            категория: <a href=\'#\' id=\'taojet_selected_category\'>Все<\/a>\n            <input type=\"hidden\" name=\"taobao_id_of_selected_category\" value=\"\" />\n        <\/div>\n\n        <div class=\"taojet_show_params\">\n          <a href=\'#\' id=\"tj_advanced_link\" onclick=\'taojet_show_search_params();return false;\'>опции<\/a>\n          <div id=\"taojet_search_params\" class=\"shadow\">\n            <div class=\"taojet_btn_close\" onclick=\"taojet_close_lightbox()\"><\/div>\n            <input type=\"checkbox\" id=\"taojet_on_sale\" value=\"true\" name=\"on_sale\">только со скидками\n            <div class=\"taojet_prices_params\">\n              цена: <input id=\"taojet_price_from\" placeholder=\"от\" name=\"price_from\">\n              <input id=\"taojet_price_to\" placeholder=\"до\" name=\"price_to\"> CNY\n            <\/div>\n          <\/div>\n        <\/div>\n      <\/form>\n\n      <div class=\"taojet_user_block\">\n        <a href=\'#\' id=\'taojet_queries_info_link\'>история<\/a>\n      <\/div>\n\n      <div id=\'taojet_lightbox\'>\n        <div class=\"taojet_btn_close\" onclick=\"taojet_close_lightbox()\"><\/div>\n\n        <ul id=\'taojet_categories\'>\n        <\/ul>\n\n        <div class=\'taojet_tabbed_area\' id=\'taojet_queries_info\'>\n          <ul class=\'taojet_tabs\'>\n            <li>\n              <a href=\'\' id=\'taojet_top_10_tab\' class=\'active\'>Топ-10 запросов<\/a>\n            <\/li>\n            <li>\n              <a href=\'\' id=\'taojet_queries_history_tab\'>История моих запросов<\/a>\n            <\/li>\n          <\/ul>\n\n          <div id=\'taojet_top_10_content\' class=\'taojet_content\'>\n            <ul>\n              <li>\n                <span class=\"taojet_it_counter\">1<\/span><a href=\'#\' onclick=\'taojet_put_text(this);return false;\'>сумки<\/a>\n                <small>запросы: 1461<\/small>\n              <\/li>\n                            <li>\n                <span class=\"taojet_it_counter\">2<\/span><a href=\'#\' onclick=\'taojet_put_text(this);return false;\'>женские платья<\/a>\n                <small>запросы: 1282<\/small>\n              <\/li>\n                            <li>\n                <span class=\"taojet_it_counter\">3<\/span><a href=\'#\' onclick=\'taojet_put_text(this);return false;\'>платья<\/a>\n                <small>запросы: 1245<\/small>\n              <\/li>\n                            <li>\n                <span class=\"taojet_it_counter\">4<\/span><a href=\'#\' onclick=\'taojet_put_text(this);return false;\'>платье<\/a>\n                <small>запросы: 1176<\/small>\n              <\/li>\n                            <li>\n                <span class=\"taojet_it_counter\">5<\/span><a href=\'#\' onclick=\'taojet_put_text(this);return false;\'>детская одежда<\/a>\n                <small>запросы: 1125<\/small>\n              <\/li>\n                            <li>\n                <span class=\"taojet_it_counter\">6<\/span><a href=\'#\' onclick=\'taojet_put_text(this);return false;\'>zara<\/a>\n                <small>запросы: 809<\/small>\n              <\/li>\n                            <li>\n                <span class=\"taojet_it_counter\">7<\/span><a href=\'#\' onclick=\'taojet_put_text(this);return false;\'>часы<\/a>\n                <small>запросы: 788<\/small>\n              <\/li>\n                            <li>\n                <span class=\"taojet_it_counter\">8<\/span><a href=\'#\' onclick=\'taojet_put_text(this);return false;\'>сумка<\/a>\n                <small>запросы: 742<\/small>\n              <\/li>\n                            <li>\n                <span class=\"taojet_it_counter\">9<\/span><a href=\'#\' onclick=\'taojet_put_text(this);return false;\'>женские пуховики<\/a>\n                <small>запросы: 704<\/small>\n              <\/li>\n                            <li>\n                <span class=\"taojet_it_counter\">10<\/span><a href=\'#\' onclick=\'taojet_put_text(this);return false;\'>женская обувь<\/a>\n                <small>запросы: 642<\/small>\n              <\/li>\n              <\/ul>\n          <\/div>\n          <div id=\'taojet_queries_history_content\' class=\'taojet_content\'>\n            <ul id=\"taojet_query_history\"><\/ul>\n            <div id=\"taojet_pagination\">\n<\/div>\n          <\/div>\n        <\/div>\n        <div class=\"tjnfo\"><a href=\"http://www.taojet.ru\" target=\"_blank\">поиск TaoJet.ru<\/a><\/div>\n      <\/div>\n  <\/div>\n\n<\/div>\n\n";

    /* load query history */
    taojet_get_user_queries_from_page(1);

    /* events */
    /* lightbox of categories */
    var selected_category = document.getElementById("taojet_selected_category"),
        queries_info_link = document.getElementById("taojet_queries_info_link");

    selected_category.onclick = function(){
        var categories = document.getElementById("taojet_categories");
        taojet_open_lightbox_with(categories);
        return false;
    }

    queries_info_link.onclick = function(){
        var queries_info = document.getElementById("taojet_queries_info");
        taojet_open_lightbox_with(queries_info);
        return false;
    }

    /* change tabs */
    var first_block = document.getElementById("taojet_top_10_tab"),
        second_block = document.getElementById("taojet_queries_history_tab");

    first_block.onclick = function(){
        taojet_tab_switch("taojet_top_10_tab", "taojet_top_10_content");
        return false;
    }

    second_block.onclick = function(){
        taojet_tab_switch("taojet_queries_history_tab", "taojet_queries_history_content");
        return false;
    }

    taojet_create_search_catalog();

    autocomplete('taojet_query_text', 'autocomplete-popup', 'http://search.taojet.com/api/autocomplete')
    $("#taojet_use_image_search").css('display', 'block');
}

function load_image_search_scripts(){
     if (typeof jQuery == 'undefined') {
         setTimeout('load_image_search_scripts()', 500);
     } else {
        $.getScript('http://search.taojet.com/assets/jquery.fineuploader-3.0.min-66ce5d4d3f522e88f50f935a6dbe20e0.js', function(response,status){
                $.getScript('http://search.taojet.com/api/files/image_search.js');
         });
     }
}

window.onload = function (){
    taojet_run();

}


