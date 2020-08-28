if ($('.adc-page').length) {

	$(window).on('load resize', function(){
		changePicture('.page-switcher__desktop', './img/desktop.png');
		$('.page-pictures__show').css({marginLeft: `${$('.mobile').offset().left}px`})
		$('.adc-cards .card').height(getAdcCardsMaxHeight())
	})

}

function getAdcCardsMaxHeight(){
	let heights = [];
	$('.adc-cards .card__text').each(function(){
		heights.push( $(this).height() )
	})
	return Math.max(...heights)
}

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

$(function() {

	changePicture('.page-switcher__desktop', './img/desktop.png')
	changePicture('.page-switcher__mobile', './img/mobile.png')

	const body = $('body');
	$('html, body').css({maxHeight: 'unset', overflowY: 'initial'})
	// <МОДАЛЬНЫЕ ОКНА>
	// дефолтная скорость анимации модального окна
	$.arcticmodal('setDefault', {
		speed: 200
	});

	function blockScroll() {
		return $('html, body').css({maxHeight: '100vh', overflowY: 'hidden'})
	}
	function accessScroll() {
		return $('html, body').css({maxHeight: 'unset', overflowY: 'initial'})
	}

	function closeOnSideTouch(touchWithoutClosing, classToRemove){
		$(document).on('mouseup',function (e){
			var div = $(touchWithoutClosing);
			if (!div.is(e.target) && div.has(e.target).length === 0) {
				div.removeClass(classToRemove)
				$('.search-input').css({borderRadius: '5px 5px 5px 5px'})
				accessScroll()
			}
			else {
				blockScroll()
			}
			if(div.hasClass(classToRemove)){
				$('.overlay').css({zIndex: 100, display: 'block'})
			}else{
				$('.overlay').css({zIndex: -100, display: 'none'})
			}
		})
	}

	function closeOnSideTouch__noOverlay(touchWithoutClosing, classToRemove){
		$(document).on('mouseup',function (e){
			var div = $(touchWithoutClosing);
			if (!div.is(e.target) && div.has(e.target).length === 0) {
				div.removeClass(classToRemove)
			}
		})
	}

	$('.datepicker-item').datepicker()
	//
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
	// </МОДАЛЬНЫЕ ОКНА>

	// <Окно поиска>
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
	// </Окно поиска>

	$(".accordion-header").on("click", function() {
		$(this).toggleClass("accordion-header--active").next().slideToggle();
	});
	$(".accordion-header--active").next().slideToggle()

	$('.scrolltop-btn').click(function(){
		$("html, body").animate({ scrollTop: 0 }, 200);
		return false;
	});

	$('.usercard__menu-toggle-btn, .usercard__close-nav-btn').click(() => {
		$('.usercard__sidebar').toggleClass('usercard__sidebar--active');
		if($('.usercard__sidebar--active').length){
			blockScroll()
			$('.overlay').css({zIndex: 100, display: 'block'})
		} else{
			accessScroll()
			$('.overlay').css({zIndex: -100,  display: 'none'})
		}
	})

	closeOnSideTouch('.usercard__sidebar', 'usercard__sidebar--active')

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

	$('.masked-phone-input').mask('+7(999) 999 99 99');

});
