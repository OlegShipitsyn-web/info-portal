$(function() {

	const body = $('body');
	// <МОДАЛЬНЫЕ ОКНА>
	// дефолтная скорость анимации модального окна
	$.arcticmodal('setDefault', {
		speed: 200
	});

	function blockScroll() { 
		return $('html, body').css({maxHeight: '100vh', overflowY: 'hidden'})
	}
	function accessScroll() { 
		return $('html, body').css({maxHeight: '100%', overflowY: 'auto'})
	}

	function closeOnSideTouch(itemWithClass, classToRemove){
		$(document).on('mouseup',function (e){
			var div = $(itemWithClass); 
			if (!div.is(e.target) && div.has(e.target).length === 0 && $(body).has(e.target)) { 
				div.removeClass(classToRemove)
				$('.search-input').css({borderRadius: '5px 5px 5px 5px'})
			}
			if(div.hasClass(classToRemove)){
				$('.overlay').css({zIndex: 100, display: 'block'})
			}else{
				$('.overlay').css({zIndex: -100, display: 'none'})
				accessScroll()
			}
		})
	}

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

	$('.scrolltop-btn').click(function(){
		$("html, body").animate({ scrollTop: 0 }, 600);
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
});

