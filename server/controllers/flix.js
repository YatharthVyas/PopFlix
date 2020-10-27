exports.getHome = (req, res) => {
  res.render('Auth/home', {
    pg: 'home',
  });
};
