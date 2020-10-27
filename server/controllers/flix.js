
exports.getHome = (req,res,next) =>{
    res.render("Auth/home",{
        pg:"home"
    });
}