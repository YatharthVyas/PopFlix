const query = require('../util/db').query();

exports.getBookFlix = async (req, res,next) => {
	try
	 {
		 let theaters= await query(`SELECT * from theater;`);
		 let indx=0;
		 while(indx<theaters.length)
		 { 
			let movies= await  query(`SELECT name from movies where m_id IN (select m_id from shows where t_id=${theaters[indx].t_id});`);
			theaters[indx].movies=movies;
			indx=indx+1;
		 }
		 console.log(theaters);
		 return res.render('Bookings/flix', {
			pg: 'book_flix',
			theaters:theaters
		});
	 }
	 catch(err){
		console.log(err);
		/*TODO Error pg */
	 }
	
	
};
// if(err)
// 	console.log(err);
// 	let indx=0;

// 	while(indx<result.length)
// 	{	
// 		let mov=[];
// 		mov=query(`SELECT name from movies where m_id IN (select m_id from shows where t_id=${result[indx].t_id});`,(err,films,field)=>{
// 			return films;
// 		})
// 		result[indx].movies=mov;
// 		console.log(result[indx],"AAAA");
// 		indx=indx+1;
// 	}
exports.getMovieFlix = async (req, res) => {
	let lan={"Ma":"Marathi","EN":"English","Hi":'Hindi'}
	try
	 {
		 let movies= await query(`SELECT * FROM movies WHERE release_date < CURDATE() ORDER BY release_date DESC LIMIT 10;`);
		 let indx=0;
		 while(indx<movies.length)
		 {	console.log(typeof(movies[indx].release_date));
			let ar=movies[indx].release_date.toString().split(' ');
			console.log(ar[1],ar[2],ar[3]);
			movies[indx].release_date=ar;
			let x=movies[indx].language;
			let y="Marathi";
			if(x=="EN")
			y="English"
			else if(x=="Hi")
			y="Hindi"
			movies[indx].language=y;
			indx=indx+1;
		 }
		 res.render('Bookings/movie', {
			pg: 'book_movie',
			movies:movies
		});
	 }
	 catch(err){
		console.log(err);
		/*TODO Error pg */
	 }
	
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