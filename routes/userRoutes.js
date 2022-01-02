var user = require('../api/userController.js')
const passport = require('../api/middleware/passport.js');

module.exports = (app)=> {
    //Register | Sing Up
    app.post('/login', user.login);
    app.post('/register',(request,response)=>{user.Register(request,response)})
    // getAllUsers
    app.get('/userData',passport.authentification, user.getAllUsers);
    //GetUser
    app.get('/getUser/:email',passport.authentification,(request,response)=>{var email=request.params.email;user.GetUser(email,request,response)})
    //GetUserById
    app.get('/findByIduser/:id',passport.authentification,(request,response)=>{var id=request.params.id;user.GetUserById(id,request,response)})
     //verifyMail
    app.get('/verifyMail/:id',(request,response)=>{var id=request.params.id;user.VerifyMail(id,response)})
    //passwordRecovery
    app.post('/passwordRecovery',(request,response)=>{user.GetRecoveryCode(request,response)})
    ///addition by Hamza
    app.post('/passwordRecoveryWebEJS',(request,response)=>{user.ResetPasswordRequestLink(request,response)})
    app.post('/verify-reset',(request,response)=>{user.verifyResetPasswordCredentials(request,response)})
    //passwordReset
    app.put('/passwordReset',(request,response)=>{user.ResetPassword(request,response)})
    //updateUserEmail
    app.put('/updateUserEmail',passport.authentification,(request,response)=>{user.UpdateUserEmail(request,response)})
    app.put('/updatecompletedInformation',passport.authentification,(request,response)=>{user.setAscompletedInformation(request,response)})
    app.put('/updateUser',passport.authentification,(request,response)=>{user.UpdateUser(request,response)})
    //LoginWithFacebook
    app.post('/LoginWithFacebook',passport.authentification,(request,response)=>{user.LoginWithFacebook(request,response)})
}