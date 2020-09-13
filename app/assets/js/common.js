// функции и эвент-листенеры вынесены за пределы jquery.ready
// блока для корректной работы в firefox
// если мы находимлся на странице adc.html
let x;
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

    // $.fn.equivalentWidth = function (){
    //     var $blocks = $(this),
    //         //примем за максимальную высоту - высоту первого блока в выборке и запишем ее в переменную maxH
    //         maxW    = $blocks.eq(0).width();
	//
    //     //делаем сравнение высоты каждого блока с максимальной
    //     $blocks.each(function(){
    //         maxW = ( $(this).width() > maxW ) ? $(this).width() : maxW;
    //     });
    //     //устанавливаем найденное максимальное значение высоты для каждого блока jQuery выборки
    //     $blocks.width(maxW);
	// 	console.log(maxW);
    // }


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
	$(".accordion-header--active").next().css({display: 'block'})

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
	// const makeSeparatedHeading = heading =>{
	// 	let textArr = heading.text().split(" ").reverse()
	// 	heading.text("")
	// 	textArr.forEach((word) => heading.prepend(`<span>${word}&nbsp;</span>`) && $('.usercard__status').appendTo(heading))
	//
	// }
	// makeSeparatedHeading($('.usercard__heading__text'))


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

	// =========================================

	function getSearchItem_TEMPLATE(){
		return	`
		<li class="search-list__item search-item">
			<a class="d-col ai-start" href="#">
				<span class="search-item__heading">${this.name || ''}</span>
				<span class="search-item__status ${this.status || ''}">${this.statusText || ''}</span>
				<div class="row search-item__row">
					<div class="search-item__city">${this.city || ''}</div>
					<div class="search-item__identification-number identification-number row">
						<span class="identification-number__type">ИНН</span>
						<span class="identification-number__number">${this.inn || ''}</span>
					</div>
					<div class="search-item__identification-number identification-number row">
						<span class="identification-number__type">ОГРН</span>
						<span class="identification-number__number">${this.ogrn || ''}</span>
					</div>
				</div>
			</a>
		</li>`
	}

	var typingTimer;
	var doneTypingInterval = 300;

	// функция для проверки оригинальности заголовка
	// function isHeadingExisting( headings, compare ){
	//
	// 	let existing = []
	// 	headings.each(function(){
	// 		( $(this).text().trim() === compare.trim() ) && existing.push(compare)
	// 	})
	//
	// 	return Boolean(existing.length)
	// }

	$('.search-input input').each(function(){
		$(this).on('keyup', function () {
		 clearTimeout(typingTimer);
		 typingTimer = setTimeout(doneTyping, doneTypingInterval);
		});

		$(this).on('keydown', function () {
		 clearTimeout(typingTimer);
		});

		function doneTyping () {
			const searchList = $('.search-items')
			if ($('.search-input input').val() === '') {
				$('.search-items').html('')
			} else {
				$.ajax({
					url: 'http://localhost:8080/',
					cache: true,
					success: function(json){
						let data = JSON.parse(json)
						data.forEach( elem => searchList.prepend(getSearchItem_TEMPLATE.call(elem) ))
					}
				})
			}
		}
	})
	// ========================================

	$('.change-coefs').each(function(){
		$(this).click(function(){
			$('.change-coefs').removeClass('sort-btn--active')
			$(this).addClass('sort-btn--active')
			let thisBtn = $(this)
			let btnIndex = $(this).index()
			$('.coefs').each(function(){
				$(this).removeClass('coefs--active')
				if ($(this).index() === thisBtn.index()) {
					$(this).addClass('coefs--active')
				}
			})
		})
	})

	const chartSwitchers = $('.chart-switcher').toArray()
	const entityCharts = $('.entity-chart').toArray()
	const removeActiveClassesFromCharts = () => entityCharts.map( chart => chart.classList.remove('entity-chart--current') )

	chartSwitchers.forEach((item, i) => item.onclick = () => removeActiveClassesFromCharts() && entityCharts[i].classList.add('entity-chart--current'));


	$('.search-input__delete-close-btn').click(() => $('.mobile-search input').val(''))



	entityChartJson1 = JSON.stringify([
		{val: 350, year: 2015},
		{val: 400, year: 2016},
		{val: 370, year: 2017},
		{val: 430, year: 2018},
		{val: 390, year: 2019},
		{val: 460, year: 2020},
	])
	entityChartJson2 = JSON.stringify([
		{val: 450, year: 2015},
		{val: 400, year: 2016},
		{val: 370, year: 2017},
		{val: 430, year: 2018},
		{val: 590, year: 2019},
		{val: 460, year: 2020},
	])
	entityChartJson3 = JSON.stringify([
		{val: 250, year: 2015},
		{val: 300, year: 2016},
		{val: 570, year: 2017},
		{val: 480, year: 2018},
		{val: 390, year: 2019},
		{val: 360, year: 2020},
	])
	financesChartJson1 = JSON.stringify([
		{val: 380, year: 2015},
		{val: 420, year: 2016},
		{val: 370, year: 2017},
		{val: 430, year: 2018},
		{val: 390, year: 2019},
		{val: 460, year: 2020},
	])
	financesChartJson2 = JSON.stringify([
		{val: 350, year: 2015},
		{val: 400, year: 2016},
		{val: 370, year: 2017},
		{val: 430, year: 2018},
		{val: 390, year: 2019},
		{val: 460, year: 2020},
	])
	financesChartJson3 = JSON.stringify([
		{val: 450, year: 2015},
		{val: 400, year: 2016},
		{val: 370, year: 2017},
		{val: 430, year: 2018},
		{val: 590, year: 2019},
		{val: 460, year: 2020},
	])

	// creates diagrams depending on the presence of a chart element on the page
	if ($('.entity-chart').length) {
		Chart.defaults.global.defaultFontFamily = "sans";
		Chart.defaults.global.defaultFontSize = 10;
		createDefaultChart($('#entityChart1'), entityChartJson1, 4)
		createDefaultChart($('#entityChart2'), entityChartJson2, 4)
		createDefaultChart($('#entityChart3'), entityChartJson3, 5)
	}
	if ($('.finances-chart').length) {
		Chart.defaults.global.defaultFontFamily = "sans";
		Chart.defaults.global.defaultFontSize = 10;
		createDefaultChart($('#financesChart1'), financesChartJson1, 4)
		createDefaultChart($('#financesChart2'), financesChartJson2, 4)
		createDefaultChart($('#financesChart3'), financesChartJson3, 4)
	}
	function createDefaultChart(elem, json, size) {

		const jsonData = JSON.parse(json)
		const labelsFromJSON = jsonData.map( obj => obj.year )
		const pointsFromJSON = jsonData.map( obj => obj.val )

		var speedData = {
		  labels: labelsFromJSON,
		  datasets: [{
		    label: "млн, руб",
		    data: pointsFromJSON,
			lineTension: 0,
		    fill: false,
		    borderColor: 'rgba(0, 81, 255, .3)',
		    backgroundColor: 'transparent',
		    pointBorderColor: '#86BE16',
		    pointBackgroundColor: '#86BE16',
		    pointRadius: 4,
		    pointHoverRadius: 5,
		    pointHitRadius: 30,
		    pointBorderWidth: 1,
		    pointStyle: 'circle',
			zeroLineBorderDashOffset: 20.20
		  }]
		};

		// let fullPath = (Math.max(...pointsFromJSON)) - (Math.min(...pointsFromJSON))
		// let percent = (fullPath / 100)
		// let step = Math.round((percent * (100 / size)))
		// let roundedStep = ( step - (step % 5) )
		// console.log(roundedStep);

		var chartOptions = {
			gridLines: {
				ticks: {
					// zeroLineBorderDashOffset: 20.20
				}
			},
			responsive: true,
		    legend: {
		        display: false,
		        position: 'top',
		        labels: {
		            boxWidth: 80,
		            fontColor: '#666666',
		        },
		    },
			layout: {

			},
		    scales: {
		        yAxes: [{
					gridLines: {
						display: true,
						borderDash: [5],
						borderDashOffset: 2.10,
						padding: 0,
						lineWidth: 1,
					},
		            ticks: {
	      				padding: 10,
						// beginAtZero: true,
						// zeroLineBorderDashOffset: 2.2
                        // stepSize: roundedStep,
						// min: Math.min(...pointsFromJSON),
						// max: Math.max(...pointsFromJSON),
						maxTicksLimit: size
		            }
		        }],
		        xAxes: [{
					position: 'top',
					gridLines: {
						color: '#FFFFFF',
						zeroLineColor: '#fff'
					},
		            ticks: {
	      				padding: 10,
						// beginAtZero: true,
						// zeroLineBorderDashOffset: 2.2
		            },
		        }],
		    },
			tooltips: {
				   callbacks: {
				   title: function(tooltipItem, data) {
					 return data['labels'][tooltipItem[0]['index']];
				   },
				   label: function(tooltipItem, data) {
					 return data['datasets'][0]['data'][tooltipItem['index']] + ' млн';
				   },
				   afterLabel: function(tooltipItem, data) {
					 console.log(chartOptions.tooltips.callbacks);
					 var dataset = data['datasets'][0];
					 let current = (data['datasets'][0]['data'][tooltipItem['index']] - (data['datasets'][0]['data'][tooltipItem['index']-1])) || 0;
					 return (current >= 0) ? '+' + current + ' млн. руб.' : current + ' млн. руб.'
				   },
				 },
			 	backgroundColor: '#F8FAFF',
			 	titleFontColor: '#86be16',
			 	bodyFontColor: '#5c6ac0',
			 	borderColor: '#d6d8e4',
			 	borderWidth: 1,
			 	caretSize: 6,
			 	cornerRadius: 2,
			 	xPadding: 10,
			 	yPadding: 8,
			 	displayColors: false,
			 	titleFontSize: 12,
			 	bodyFontSize: 13
		 }
	 };

		return new Chart(elem, {
		  type: 'line',
		  data: speedData,
		  options: chartOptions,
		  scaleOverride : true,
	  })
	}


});
