
exports.getBookFlix = (req,res,next) =>{
    res.render("Bookings/flix",{
        pg:"book-flix"
    });
}
exports.getMovieFlix = (req,res,next) =>{
    res.render("Bookings/movie",{
        pg:"book-movie"
    });
}