$('[name="phone"]').mask('+7 (999) 999-99-99');

const burger = document.querySelector('.navbar-toggler');
if (burger) {
	const navbar = document.querySelector('.navbar');
	const close = document.querySelector('.offcanvas .btn-close');
	burger.addEventListener('click', function () {
		navbar.classList.add('active');
	});
	close.addEventListener('click', function () {
		navbar.classList.remove('active');
	});
}

const modalBtn = document.querySelector('.catalog-content__filter-mob');
if (modalBtn) {
	const modalFilter = document.querySelector('.catalog-filter');
	const close = document.querySelector('.catalog-filter .btn-close');
	const body = document.querySelector('body');
	const apply = document.querySelector('.catalog-filter__apply');
	modalBtn.addEventListener('click', function () {
		modalFilter.classList.add('active');
		body.classList.add('active');
	});
	close.addEventListener('click', function () {
		modalFilter.classList.remove('active');
		body.classList.remove('active');
	});
	apply.addEventListener('click', function () {
		modalFilter.classList.remove('active');
		body.classList.remove('active');
	});
}

$('.team__slider').slick({
	infinite: true,
	slidesToShow: 5,
	slidesToScroll: 1,
	speed: 600,
	prevArrow: '.team-arrow-prev',
	nextArrow: '.team-arrow-next',
	responsive: [
		{
			breakpoint: 992,
			settings: {
				slidesToShow: 2,
			}
		},
	]
});

$(document).ready(function () {
	$('.slick-current').find('.team__info').addClass('active').show();

	function updateActiveSlide() {
		$('.team__info').removeClass('active').hide();

		var $currentSlide = $('.slick-current');
		$currentSlide.find('.team__info').addClass('active').show();
	}

	$('.team__slider').on('click', '.slick-slide', function () {
		var $currentSlide = $('.slick-current');
		var $clickedSlide = $(this);

		if (!$clickedSlide.is($currentSlide)) {
			$currentSlide.removeClass('slick-current');
			$clickedSlide.addClass('slick-current');
			updateActiveSlide();

			$('.team__slider').slick('slickGoTo', $clickedSlide.data('slick-index'));
		}
	});

	$('.team-arrow-prev').on('click', function () {
		setTimeout(updateActiveSlide, 100);
	});

	$('.team-arrow-next').on('click', function () {
		setTimeout(updateActiveSlide, 100);
	});

	$('.team__slider').on('afterChange', function (event, slick, currentSlide) {
		updateActiveSlide();
	});
});


$('.reviews__slider').slick({
	infinite: true,
	slidesToShow: 3,
	slidesToScroll: 1,
	speed: 600,
	prevArrow: '.reviews-arrow-prev',
	nextArrow: '.reviews-arrow-next',
	responsive: [
		{
			breakpoint: 576,
			settings: {
				slidesToShow: 1,
			}
		},
	]
});

$('.news-article__slider').slick({
	infinite: true,
	slidesToShow: 1,
	slidesToScroll: 1,
	speed: 600,
	prevArrow: '.news-article-arrow-prev',
	nextArrow: '.news-article-arrow-next',
});

const [wrapper] = $('.plane-floor') ?? []
if (wrapper) {
	const diffWidth = wrapper.scrollWidth - wrapper.clientWidth
	const diffHeight = wrapper.scrollHeight - wrapper.clientHeight
	wrapper.scroll(diffWidth / 2, diffHeight / 2)
};

$('.building-card-gallery__slider').slick({
	infinite: true,
	slidesToShow: 2,
	slidesToScroll: 1,
	speed: 600,
	prevArrow: '.building-card-gallery-arrow-prev',
	nextArrow: '.building-card-gallery-arrow-next',
});

/* jquery ui */
$(function () {
	$("#sorting").selectmenu();
	$("#buildings").selectmenu();
	$(".checkbox-policy").checkboxradio();
	$(".catalog-filter__checkbox input").checkboxradio();
});

$(function () {
	$(".catalog-filter-range").each(function () {
		var $range = $(this);
		var $fromInput = $range.find(".from");
		var $toInput = $range.find(".to");
		var $sliderRange = $range.find(".slider-range");

		var minValue = parseInt($fromInput.data("min"), 10);
		var maxValue = parseInt($toInput.data("max"), 10);

		var defaultFromValue = parseInt($sliderRange.data("value-from"), 10) || minValue;
		var defaultToValue = parseInt($sliderRange.data("value-to"), 10) || maxValue;

		$sliderRange.slider({
			range: true,
			min: minValue,
			max: maxValue,
			values: [defaultFromValue, defaultToValue],
			slide: function (event, ui) {
				$fromInput.val(ui.values[0]);
				$toInput.val(ui.values[1]);
			}
		});

		$fromInput.val($sliderRange.slider("values", 0));
		$toInput.val($sliderRange.slider("values", 1));

		$fromInput.on("input", function () {
			var fromValue = parseInt($(this).val(), 10);
			var toValue = parseInt($toInput.val(), 10);

			if (!isNaN(fromValue) && fromValue >= minValue && fromValue <= maxValue && fromValue <= toValue) {
				$sliderRange.slider("values", 0, fromValue);
			}
		});

		$toInput.on("input", function () {
			var toValue = parseInt($(this).val(), 10);
			var fromValue = parseInt($fromInput.val(), 10);

			if (!isNaN(toValue) && toValue >= minValue && toValue <= maxValue && toValue >= fromValue) {
				$sliderRange.slider("values", 1, toValue);
			}
		});
	});
});

/* сторис */
function getFullHref(href) {
	return new URL(href, document.baseURI).toString()
}

let player
let storyElements

function hidePlayer() {
	renderWatched()
	document.querySelector('.lightbox').classList.add('closed')
	player.pause()
}

async function setStoryContentLoadedHandler(story, handler) {
	const port = (await story.messagingPromise).port_
	function listener(e) {
		const data = e.data
		if (data.app !== '__AMPHTML__' || data.name !== 'storyContentLoaded') return
		handler(story.href)
	}
	port.addEventListener('message', listener)
}

function unhideLightbox() {
	document.querySelector('.lightbox').classList.remove('hidden')
}

async function showPlayer(href) {
	document.querySelector('.lightbox').classList.remove('closed')
	document.querySelector('.lightbox').classList.add('hidden')
	const p = player.show(href, null, { animate: false })
	const story = player.getStories().find((s) => s.href === href)
	if (!story) return
	if (story.storyContentLoaded) unhideLightbox()
	else setStoryContentLoadedHandler(story, unhideLightbox)
	player.play()
}

function getWatchedState() {
	const globalState = JSON.parse(localStorage.getItem('amp-story-state') || '{}')
	const watchedState = {}
	for (const story of storyElements) {
		const href = story.dataset.href
		if (!href) continue
		watchedState[href] = href in globalState
	}
	return watchedState
}

function renderWatched() {
	const storyElements = document.querySelectorAll('.stories__item')
	const watchedState = getWatchedState()

	for (const story of storyElements) {
		const href = story.dataset.href
		if (href && watchedState[href]) story.dataset.watched = true
	}
}

function fixupHrefs() {
	for (const story of storyElements) {
		const humanHref = story.dataset.href
		if (!humanHref) continue
		story.dataset.href = getFullHref(humanHref)
	}
}

function addInteractivity() {
	// show story on click
	for (const story of storyElements) {
		const href = story.dataset.href
		if (!href) continue
		story.addEventListener('click', () => showPlayer(href))
	}

	// set up listeners for player controls and events
	player.addEventListener('amp-story-player-close', () => hidePlayer())
	player.addEventListener('noNextStory', () => hidePlayer())
	player.addEventListener('noPreviousStory', () => hidePlayer())
}

function setupPlayer() {
	const storyDescriptions = []
	for (const story of storyElements) {
		const href = story.dataset.href
		if (!href) continue
		storyDescriptions.push({ href })
	}
	player.add(storyDescriptions)
}

function onPlayerReady() { }

window.addEventListener('DOMContentLoaded', () => {
	player = document.querySelector('.my-player')
	if (!player) return console.error('Could not find a player')
	storyElements = document.querySelectorAll('.stories__item')
	fixupHrefs()
	renderWatched()
})

window.addEventListener('load', () => {
	setupPlayer()
	addInteractivity()
	if (player.isReady) onPlayerReady()
	else player.addEventListener('ready', () => onPlayerReady())
})