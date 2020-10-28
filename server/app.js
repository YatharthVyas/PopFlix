const mysql = require("mysql");
const express = require("express");
const path = require("path");
const flixroutes = require("./routes/flix");
const userroutes = require("./routes/user");

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'popflix'
});

const app = express();
// connection.connect();

db.connect();

const app = express();

app.use(
	session({
		secret: 'MYS',
		resave: true,
		saveUninitialized: false,
		ephemeral: true,
	})
);

// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', 'views');

app.get('/', (req, res) => {
	res.redirect('/flix/home');
});

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/flix', flixRoutes);
app.use('/user', userRoutes);

app.listen(3000, () => {
	console.log('Server started on port 3000');
});