exports.getHome = (req, res, next) => {
  res.render("Auth/home", {
    pg: "home",
  });
};
exports.getAboutUs = (req, res, next) => {
  res.render("Auth/aboutus", {
    pg: "aboutus",
  });
};
