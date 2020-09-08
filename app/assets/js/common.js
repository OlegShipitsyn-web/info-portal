// функции и эвент-листенеры вынесены за пределы jquery.ready
// блока для корректной работы в firefox

// если мы находимлся на странице adc.html
if ($('.adc-page').length) {
	// при загрузке и ресайзе запускаем функции для выравнивания высоты
	// adc cards и смены изображений по клику
	$(window).on('load resize', function(){
		changePicture('.page-switcher__desktop', '/assets/img/desktop.png');
		$('.page-pictures__show').css({marginLeft: `${$('.mobile').offset().left}px`})
		$('.adc-cards .card').height(getAdcCardsMaxHeight())
	})
}

// если на странице присутствует таблица финансов (таблица со сменяющимися пунктами)
// в последнем столбце на мобильных устройствах
if ($('.finances-table').length){
	// метяем аттрибуты colspan для корректного отображения на всех типах устройств
	$(window).on('resize load', function(){
		if(window.matchMedia('(min-width: 568px)').matches){
			$('.finances-table__explain-expanded').attr("colspan","1");
		} else{
			$('.finances-table__explain-expanded').attr("colspan","2");
		}
	})
}

// функция возвращает высоту самой большой карточки из adc-cards
function getAdcCardsMaxHeight(){
	let heights = [];
	$('.adc-cards .card__text').each(function(){
		heights.push( $(this).height() )
	})
	return Math.max(...heights)
}

// функция для изменения картинки по клику на копку (страница adc.html)
function changePicture(elem, imgPath){
	const makeChange = function makeChange() {
		$('.page-switcher .sort-btn').each(function() {
			$(this).removeClass('sort-btn--active')
		})
		$(elem).addClass('sort-btn--active')
		$('.desktop').attr('src', imgPath)
	}
	$(elem).click(makeChange)

	return makeChange()
}

// функция, содержащая в себе логику разбиения таблицы финансов на N
// количество подмассивов (в зависимости от количества колонок в таблице)
// в каждый из подмассивов попадает контент с классами .real-number для
// последующего встраивания в колонку и изменения по клику на кнопки-стрелочки
function getSeparatedTableColumns(){

	// вычисляем общее количество сменяемых элементов в таблице
	const valuesToSwitch = $('.finances-table .real-number');
	// вычисляем количество колонок со сменяемым контентом
	const rowsQuantity = $('.finances-table .finances-table__thead-numeric').length;

	// создаём переменную для итерирования
	let rowsQuantity_iterable = rowsQuantity;

	// переменная для финального массива из n-ного количества подмассивов
	// с контентом - в одном подмассиве - контент одной колонки
	let separatedTableColumns = [];
	// создаём изменяющуюся переменную для подмассива
	let subArr = [];

	for(; rowsQuantity_iterable > 0; rowsQuantity_iterable--){

			valuesToSwitch.each( function( index ){
				if ( ($(this).index() % (rowsQuantity_iterable+1) === 0) &&
					 ($(this).index() % (rowsQuantity_iterable+3) !== 0) ) {
					 subArr.push($(this));
				}
			})
			separatedTableColumns.push(subArr);
			subArr = [];
	}
	// возвращаем массив и количество колонок с изменяющимся контентом
	return {
				cols: separatedTableColumns,
				size: rowsQuantity
			};
}
// создаём счётчик для переключения значений колонок в таблице
let tableCounter = 0;

// функция возвращает корректное значение счётчика для работы со сменой контента колонок
function getColCounter(sign){
	const size = getSeparatedTableColumns().size;
	if (sign === 'plus') {
		return ++tableCounter % size;
	}
	if (sign === 'minus') {
		return --tableCounter % size ;
	}
}

// функция меняет значения в мобильной колонке и встраивает контент
function switchCurrentFinanceColumn(col_index = 0){
	const columns = getSeparatedTableColumns().cols;
	const size    = getSeparatedTableColumns().size;
	let separatedColIndex = col_index;
	$('.finances-table .value-switcher').each( function( ind ){
		$(this).text( columns[separatedColIndex][ind].text() )
		// columns[separatedColIndex]
	})
	if (tableCounter > size-1) {
		$('.switch-btn-next').hide()
	} else{
		$('.switch-btn-next').show()
	}

	if (tableCounter === 0) {
		$('.switch-btn-prev').hide()
	} else{
		$('.switch-btn-prev').show()
	}
}

$(function() {

	// вызываем функцию для установления дефолтного индекса колонки (0)
	switchCurrentFinanceColumn();

	// при клике меняет контент на контент следующей колонки в таблице
	$('.switch-btn-next').click(() => switchCurrentFinanceColumn(getColCounter('plus')))
	// при клике меняет контент на контент предыдущей колонки в таблице
	$('.switch-btn-prev').click(() => switchCurrentFinanceColumn(getColCounter('minus')))


	// устанавливаем смену картинок при клике на соответствующие кнопки(adc.html)
	changePicture('.page-switcher__mobile', '/assets/img/mobile.png')
	changePicture('.page-switcher__desktop', '/assets/img/desktop.png')

	// устанавливаем дефолтные значения прокрутки
	// нужно для работы с блоком скролла и разрешением скролла
	// при взаимодействии с некоторыми ui элементами
	$('html, body').css({maxHeight: 'unset', overflowY: 'initial'})

	// дефолтная скорость анимации модального окна
	$.arcticmodal('setDefault', {
		speed: 200
	});

	// функции блокировки скролла и разрешения скролла

	// "костыльная" функция закрытия соответствющих элементов при клике не на них и не
	// на их детей
	function closeOnSideTouch(touchWithoutClosing, classToRemove){
		$(document).on('mouseup',function (e){
			var div = $(touchWithoutClosing);
			if (!div.is(e.target) && div.has(e.target).length === 0) {
				div.removeClass(classToRemove)
				$('.search-input').css({borderRadius: '5px 5px 5px 5px'})
			}
			else {

			}
			if(div.hasClass(classToRemove)){
				$('.overlay').css({zIndex: 100, display: 'block'})
			}else{
				$('.overlay').css({zIndex: -100, display: 'none'})
			}
		})
	}

	function handleSidebar(touchWithoutClosing, classToRemove){
		$(document).on('mouseup',function (e){
			var div = $('.usercard__navigation');

			if (!div.is(e.target) && div.has(e.target).length === 0) {
				$('.usercard__sidebar').removeClass(classToRemove)
				$('.search-input').css({borderRadius: '5px 5px 5px 5px'})
			}
			else {
			}
			if($('.usercard__sidebar').hasClass(classToRemove)){
				$('.overlay').css({zIndex: 100, display: 'block'})
			}else{
				$('.overlay').css({zIndex: -100, display: 'none'})
			}
		})
	}

	// такая же функция для элементов без овелея
	function closeOnSideTouch__noOverlay(touchWithoutClosing, classToRemove){
		$(document).on('mouseup',function (e){
			var div = $(touchWithoutClosing);
			if (!div.is(e.target) && div.has(e.target).length === 0) {
				div.removeClass(classToRemove)
			}
		})
	}

	// инициализируем дейтпикер
	$('.datepicker-item').datepicker()

	// функция для объявления нового модального окна
	// первый параметр - элемент, при нажатии на который открывается окно
	// второй параметр - ID окна, которое должно показаться при клике на элемент первого параметра
	// третий параметр - ID окна, которое нужно закрыть при открытии нового (опционально)
	// каждому окну при нажатии на .modal__close__btn функция прикручивает закрытие окна
	const multipleModalCallButtons = (nodeName_Btn, modal_ID, modalToClose) => {

		return $(nodeName_Btn).bind( 'click', () => $(modalToClose).arcticmodal('close')
				&& $(modal_ID).arcticmodal()
				&& $(modal_ID).find('.modal__close__btn').click(() => $(modal_ID).arcticmodal('close')))
	}

	// взаимодействие модальных окон на странице
	multipleModalCallButtons('.sign-in-btn', '#login-modal')
	multipleModalCallButtons('.registration__btn', '#register-modal')
	multipleModalCallButtons('.call-signin-btn', '#login-modal', '#register-modal')
	multipleModalCallButtons('.call-register-btn', '#register-modal', '#login-modal')
	multipleModalCallButtons('.call-pass-restore', '#pass-restore', '#login-modal')
	multipleModalCallButtons('.back-to-signin', '#login-modal', '#pass-restore')

	// Функция проверяет текущую ширину окна и меняет текст внутри поискового Input
	// в соответствии с дизайном
	const input = $('.search-input input');
	const changeSearchPlaceholder = (smallText, bigText) => {
		const query = window.matchMedia('all and (min-width: 479px)');
		return (query.matches) ? input.attr("placeholder", bigText) : input.attr("placeholder", smallText);
	}
	// При ресайзе и загрузке страницы запускам функцию changeSearchPlaceholder, с нужными параметрами
	$(window).on("resize load", () => changeSearchPlaceholder("Название, адрес, руководитель", "Искать по названию, адресу, ФИО, ОГРН и ИНН"))

	input.click(() => $('.search-input .search-list').addClass('show-results') && $('.search-input').css({borderRadius: '5px 5px 0 0'}))


	closeOnSideTouch(".search-input .search-list", 'show-results')

	// реализуем аккордион
	$(".accordion-header").on("click", function() {
		$(this).toggleClass("accordion-header--active").next().slideToggle();
	});
	$(".accordion-header--active").next().slideToggle()

	$('.scrolltop-btn').click(function(){
		$("html, body").animate({ scrollTop: 0 }, 200);
		return false;
	});

	// реализуем раскрытие меню
	$('.usercard__menu-toggle-btn, .usercard__close-nav-btn').click(() => {
		$('.usercard__sidebar').toggleClass('usercard__sidebar--active');
		if($('.usercard__sidebar--active').length){
			$('.overlay').css({zIndex: 100, display: 'block'})
		} else{
			$('.overlay').css({zIndex: -100,  display: 'none'})
		}
	})

	handleSidebar('.usercard__sidebar', 'usercard__sidebar--active')

	// фукнция для корректного переноса заголовка страницы с иконкой на мобильных устройствах
	const makeSeparatedHeading = heading =>{
		let textArr = heading.text().split(" ").reverse()
		heading.text("")
		textArr.forEach((word) => heading.prepend(`<span>${word}&nbsp;</span>`) && $('.usercard__status').appendTo(heading))

	}
	makeSeparatedHeading($('.usercard__heading__text'))


	closeOnSideTouch__noOverlay('.mobile-search, .call-search-btn', 'mobile-search--active')
	$('.call-search-btn').click(() => $('.mobile-search').toggleClass('mobile-search--active'))

	$('.datepicker-item').on('keypress', function(event){
    	event.preventDefault()
	})

	// инициализация маски для телефона
	$('.masked-phone-input').mask('+7(999) 999 99 99');

	$('.scheme__overlay').each(function(){
		let coef = Number( $(this).attr('coef') )

		return ( coef > 0 ) ? $(this).css({
			width: coef + "%",
			left: 50 + ( coef / 2 ) + "%"
		}) : $(this).css({
			width: -coef + "%",
			left: 50 - ( -coef / 2 ) + "%" })


		// $(this).css({
		// 	width: $(this).attr('xWidth'),
		// 	left: $(this).attr('xPosition')
		// })
	})

	$('.change-coefs').each(function(){
		$(this).click(function(){
			$('.change-coefs').removeClass('sort-btn--active')
			$(this).addClass('sort-btn--active')
			let thisBtn = $(this)
			let btnIndex = $(this).index
			$('.coefs').each(function(){
				$(this).removeClass('coefs--active')
				if ($(this).index() === thisBtn.index()) {
					$(this).addClass('coefs--active')
				}
			})
		})
	})

	$('.search-input__delete-close-btn').click(() => $('.mobile-search input').val(''))

	var speedCanvas = document.getElementById("speedChart");

	Chart.defaults.global.defaultFontFamily = "sans";
	Chart.defaults.global.defaultFontSize = 14;

	var speedData = {
	  labels: ["0s", "10s", "20s", "30s", "40s", "50s", "60s"],
	  datasets: [{
	    label: "Car Speed (mph)",
	    data: [0, 59, 75, 20, 20, 55, 40],
		lineTension: 0,
	    fill: false,
	    borderColor: 'orange',
	    backgroundColor: 'transparent',
	    borderDash: [5, 5],
	    pointBorderColor: 'orange',
	    pointBackgroundColor: 'rgba(255,150,0,0.5)',
	    pointRadius: 5,
	    pointHoverRadius: 10,
	    pointHitRadius: 30,
	    pointBorderWidth: 2,
	    pointStyle: 'rectRounded'
	  }]
	};

	var chartOptions = {
	  legend: {
	    display: false,
	    position: 'top',
	    labels: {
	      boxWidth: 80,
	      fontColor: 'black'
	    }
	  }
	};

	var lineChart = new Chart(speedCanvas, {
	  type: 'line',
	  data: speedData,
	  options: chartOptions
	});

});
