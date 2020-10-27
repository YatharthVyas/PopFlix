exports.getBookFlix = (req, res, next) => {
	res.render("Bookings/flix", {
		pg: "book-flix"
	});
}
exports.getMovieFlix = (req, res, next) => {
	res.render("Bookings/movie", {
		pg: "book-movie"
	});
}

exports.getSelectFlix = (req, res, next) => {
	res.render("Bookings/select_flix", {
		pg: "select-flix"
	});
}
exports.getSelectSeat = (req, res, next) => {
	res.render("Bookings/seat", {
		pg: "select-seat"
	});
}
exports.getSelectMovie = (req, res, next) => {
	res.render("Bookings/select_movie", {
		pg: "select-movie"
	});
}
exports.getSelectTime = (req, res, next) => {
	res.render("Bookings/select_time", {
		pg: "select-time"
	});
}
exports.getConfirmPayment = (req, res, next) => {
	res.render("Bookings/confirm_payment", {
		pg: "confirm-payment"
	});
}