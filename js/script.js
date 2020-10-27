function goUp() {
	window.scrollTo({
		top: 0,
		behavior: 'smooth'
	})
}
var prev_scroll_pos = 0;
window.onscroll = function hideNav() {
	if (window.pageYOffset > prev_scroll_pos && window.pageYOffset > 40) {
		document.getElementsByClassName('nav')[0].style.display = "none";
		prev_scroll_pos = window.pageYOffset;
	} else {
		document.getElementsByClassName('nav')[0].style.display = "flex";
		prev_scroll_pos = window.pageYOffset;
	}
}
window.onreload = function() { window.scrollTo(0, 0); };