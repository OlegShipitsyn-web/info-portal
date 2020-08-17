$(function() {

	// <МОДАЛЬНЫЕ ОКНА>
	// дефолтная скорость анимации модального окна
	$.arcticmodal('setDefault', {
		speed: 200
	});

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
	const input = $('.search-input--cross-section input');
	const changeSearchPlaceholder = (smallText, bigText) => {
		const query = window.matchMedia('all and (min-width: 479px)');
		return (query.matches) ? input.attr("placeholder", bigText) : input.attr("placeholder", smallText);
	}
	// При ресайзе и загрузке страницы запускам функцию changeSearchPlaceholder, с нужными параметрами
	$(window).on("resize load", () => changeSearchPlaceholder("Название, адрес, руководитель", "Искать по названию, адресу, ФИО, ОГРН и ИНН"))

	input.click(() => $('.search-input .search-list').addClass('show-results'))

	$(document).on('mouseup',function (e){
		var div = $(".search-input .search-list"); 
		if (!div.is(e.target) && div.has(e.target).length === 0) { 
			div.removeClass('show-results')
		}
	})
	// </Окно поиска>
});
