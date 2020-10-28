exports.getBookFlix = (req, res) => {
	res.render('Bookings/flix', {
		pg: 'book_flix',
	});
};
exports.getMovieFlix = (req, res) => {
	res.render('Bookings/movie', {
		pg: 'book_movie',
	});
};

exports.getSelectFlix = (req, res) => {
	res.render('Bookings/select_flix', {
		pg: 'select_flix',
	});
};
exports.getSelectSeat = (req, res) => {
	res.render('Bookings/seat', {
		pg: 'select_seat',
	});
};
exports.getSelectMovie = (req, res) => {
	res.render('Bookings/select_movie', {
		pg: 'select_movie',
	});
};
exports.getSelectTime = (req, res) => {
	res.render('Bookings/select_time', {
		pg: 'select_time',
	});
};
exports.getConfirmPayment = (req, res) => {
	res.render('Bookings/confirm_payment', {
		pg: 'confirm_payment',
	});
};