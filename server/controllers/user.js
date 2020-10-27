exports.getProfile = (req,res,next) =>{
    res.render("User/Profile",{
        pg:"profile"
    });
}