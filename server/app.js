const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const db = require("./util/db");
const flixRoutes = require("./routes/flix");
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const reviewRoutes = require("./routes/review");

db.connect();

const app = express();

app.use(
	session({
		secret: "MYS",
		resave: true,
		saveUninitialized: false,
		ephemeral: true,
	})
);

// Passport Config
require("./config/passport")(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", "views");
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/flix", flixRoutes);
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);
app.use("/review", reviewRoutes);
app.get("/", (req, res) => {
	res.redirect("/flix/home");
});
app.listen(3000, () => {
	console.log("Server started on port 3000");
});