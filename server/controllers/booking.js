exports.getBookFlix = (req, res) => {
  res.render('Bookings/flix', {
    pg: 'book-flix',
  });
};
exports.getMovieFlix = (req, res) => {
  res.render('Bookings/movie', {
    pg: 'book-movie',
  });
};

exports.getSelectFlix = (req, res) => {
  res.render('Bookings/select_flix', {
    pg: 'select-flix',
  });
};
exports.getSelectSeat = (req, res) => {
  res.render('Bookings/seat', {
    pg: 'select-seat',
  });
};
exports.getSelectMovie = (req, res) => {
  res.render('Bookings/select_movie', {
    pg: 'select-movie',
  });
};
exports.getSelectTime = (req, res) => {
  res.render('Bookings/select_time', {
    pg: 'select-time',
  });
};
exports.getConfirmPayment = (req, res) => {
  res.render('Bookings/confirm_payment', {
    pg: 'confirm-payment',
  });
};
