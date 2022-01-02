
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var userSchema = require('../models/user.js');
const passport = require('./middleware/passport.js');
const userService = require('../services/user_module');

require('dotenv').config();

module.exports = {
    login: (request, res) => {
        var post_data = request.body;
        var userPassword = post_data.password;
        var pwd = "";
        var slt = "";

        userSchema.find({ 'email': request.body.email })
            .then(value => {
                if (value.length < 1) {
                    return res.status(401).json({
                        status: "ERROR",
                        message: "Email does not exist"
                    })
                } else if (!value[0].activation) {
                    return res.status(401).json({
                        status: "ERROR",
                        message: "Please Verify your mail"
                    })
                }else if (value[0].blackListed) {
                    return res.status(401).json({
                        status: "ERROR",
                        message: "You have been blacklisted"
                    })
                }
                else {
                    var user = value[0];
                    pwd = user.password;
                    slt = user.salt;
                    var hashed_password = checkHashPassword(userPassword, slt).passwordHash; // Hash password with salt
                    var encrypted_password = pwd; // get password from user
                    if (hashed_password == encrypted_password) {
                        return res.status(200).json({
                            status: "SUCCESS",
                            token: passport.generate(user._id)
                        })
                    } else {
                        return res.status(401).json({
                            status: "ERROR",
                            message: "Wrong password"
                        })
                    }
                }
            }).catch(err => {
                res.status(500).json({
                    error: err
                })
            })
    }, getAllUsers: async (req, res, next) => {
        userSchema.find({}).then(response => {
            return res.status(200).json({
                status: "SUCCESS",
                data :response
            })
        }).catch(err => {
            res.status(500).json({
                error: err
            })
        })


    }, Register: (request, response) => {



        var post_data = request.body;
        console.log(post_data)
        var plaint_password = post_data.password;
        var firstName = post_data.firstName;
        var lastName = post_data.lastName;
        var email = post_data.email;
        var address = post_data.address;
        var phone = post_data.phone;
        var birth_date = post_data.birthDate;

        userService.getAllUsers().then(function (result) {
            var allowInsert = true;
            result.forEach((user) => {
                if (allowInsert) {
                    if (user.email == email) {
                        allowInsert = false;
                        response.status(200).json({ message: "Email already exists" });

                    }

                    if (user.phone != "Not mentioned") {
                        if (user.phone == phone && allowInsert) {
                            allowInsert = false;
                            response.status(200).json({ message: "Phone number already exists" });
                        }
                    }
                }
            }
            );
            if (allowInsert) {
                userService.Register(plaint_password, firstName, lastName, email, address, phone, birth_date, response, request, transporter);
            }
        });
    }, VerifyMail: (id, response) => {
        userService.verifyMailById(id, response)
    }, GetUser: (email, request, response) => {
        userService.getUserByEmail(/*request.body.email*/email).then(function (result) {
            response.status(200).json({
                message: "user =)",
                user: result
            })
        })
    }, GetUserById: (id, request, response) => {
        userService.getUserById(id).then(function (result) {
            response.status(200).json(result)
        })
    }, UpdateUserEmail: (request, response) => {

        var reqBody = request.body;

        var old_email = reqBody.oldEmail;
        var new_email = reqBody.newEmail;
        var password = reqBody.password;

        var birth_date = reqBody.birth_date;
        var firstName = reqBody.firstName;
        var lastName = reqBody.lastName;
        var address = reqBody.address;
        var phone = reqBody.phone;
        var photo = reqBody.photo;
        userService.getAllUsers().then(function (result) {

            var validOldEmail = false;
            var validNewEmail = true;
            var allowUpdate = false;
            var pwd = "";
            var slt = "";
            var current_user;

            result.forEach((user) => {
                if (!validOldEmail) {
                    //console.log(user.email);
                    if (user.email == old_email) {
                        validOldEmail = true;
                        pwd = user.password;
                        slt = user.salt;
                        current_user = user;
                    }
                }
            });

            //2 S
            if (!validOldEmail) { // never going to heppend
                //response.status(200).json({message:"User does not exist"}); //return this after update in bdd done
                response.status(200).json({ message: "User does not exist" });
                console.log("User does not exist")
            }

            var i = 0;
            result.forEach((user) => {
                if (validNewEmail) {
                    //console.log(user.email);
                    if (user.email == new_email && new_email != old_email) {
                        validNewEmail = false;
                    }
                }
            });

            if (validNewEmail && validOldEmail) {
                var hashed_password = checkHashPassword(password, slt).passwordHash; // Hash password with salt
                var encrypted_password = pwd; // get password from user
                if (hashed_password == encrypted_password) {
                    allowUpdate = true;
                } else {
                    response.status(200).json({ message: "Wrong password" });
                    console.log("Wrong password");
                }
            } else {
                response.status(200).json({ message: "Email already exists" });
                console.log("Email already exists");
            }
            if (allowUpdate && validNewEmail && validOldEmail) {
                current_user.email = new_email;
                if (firstName != '' && lastName != '' && phone != '' && address != '') {
                    
                    current_user.firstName = firstName
                    current_user.lastName = lastName
                    current_user.phone = phone
                    current_user.address = address
                    current_user.photo = photo
                }
                userService.updateUser(current_user, current_user.id);
                response.status(200).json({ message: "Email updated" });
                console.log("Email updated");
            }
        });



    }, LoginWithFacebook: (request, response) => {

        var reqBody = request.body;

        var first_name = reqBody.firstName;
        var last_name = reqBody.lastName;
        var email = reqBody.email;
        var signed_up_with = reqBody.signedUpWith;
        var birth_date = reqBody.birthDate;
        var photo = reqBody.photo;

        userService.getAllUsers().then(function (result) {
            var fbAccountExist = false;

            result.forEach((user) => {
                if (!fbAccountExist) {
                    if (user.email == email) {
                        fbAccountExist = true;
                    }
                }
            });

            if (fbAccountExist) {
                response.status(200).json({ message: "Registred with facebook already" });
                console.log("Registred with facebook already");
            } else {
                console.log('new facebook account');
                response.status(200).json({ message: "new facebook account" });
                userService.RegisterFb(first_name, last_name, email, signed_up_with, birth_date, photo);

            }

        });
    },
    verifyResetPasswordCredentials: async (req, res, next) => {
        const  creds  = req.body.token;
        if (!creds) {
            return res.json({ creds: false, Message: 'Ce lien est invalide!' });
        }

        const decoded = await userService.decryptUrl(creds);
        if (decoded.indexOf('uemail') == -1 || decoded.indexOf('uid') == -1) {
            return res.json({ creds: false, Message: 'Veuillez reconsulter votre boite mail, ce lien a expire' });
        }

        const splitedUrl = decoded.split('&');
        const uemail = splitedUrl[0].replace('uemail=', '');
        const userId = splitedUrl[1].replace('uid=', '');

        console.log("provided", uemail);
        const user = await userService.getUserById(userId);
        if (!user) {
            return res.json({ creds: false, Message: 'Utilisateur non trouvable' });
        }

        res.json({
            creds: true,
            Message: 'Credentials are correct',
            xd: userId,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email
        }).status(200);
    }, ResetPasswordRequestLink: (request, response) => {

        var reqBody = request.body;
        var email = reqBody.email;
        var first_name = "";
        var last_name = "";
        var code = gfg();
        console.log(email);
        userService.getAllUsers().then( async function (result) {
            var validEmail = false;
            var SetOutEmail = false;
            var users;
            result.forEach((user) => {
                if (!validEmail) {
                    if (user.email == email) {
                        validEmail = true;
                        first_name = user.firstName;
                        last_name = user.lastName;
                        users=user;  
                    }
                }
            });

            if (!validEmail) {
                response.status(200).json({ message: "Email does not exist" });
                console.log('Email does not exist');
                return;
            }

            else {
                const resetToken = await userService.generateActivationToken();
                const plainUrl = `uemail=${users.email}&uid=${users._id}`;
                const encrypted = await userService.cryptUrl(plainUrl);
                const link = `http://localhost:4200/views/passwordReset/${encrypted}`;
                await userService.sendResetPasswordLink(users, link, function (data) {
                    res.status(200).json({ message: "verification code",data:data, email: email })
                },transporter);
                //response.status(200).json({ message: "verification code", code: code, email: email })
            }

        });

    }
    , GetRecoveryCode: (request, response) => {

        var reqBody = request.body;
        var email = reqBody.email;
        var first_name = "";
        var last_name = "";
        var code = gfg();



        userService.getAllUsers().then(function (result) {
            var validEmail = false;
            var SetOutEmail = false;
            result.forEach((user) => {
                if (!validEmail) {
                    if (user.email == email) {
                        validEmail = true;
                        first_name = user.firstName;
                        last_name = user.lastName;
                        if (user.signed_up_with == "Gark application") { SetOutEmail = true; }
                    }
                }
            });

            if (!validEmail) {
                response.status(200).json({ message: "Email does not exist" });
                console.log('Email does not exist');
                return;
            }

            if (!SetOutEmail) {
                response.status(200).json({ message: "Please login with your facebook account" });
                console.log('Please login with your facebook account');
            }


            else {

                var mailOptions = {
                    from: 'gark.assistance@gmail.com',
                    to: email,
                    subject: 'Gark! Reset password',
                    text: 'That was easy!',
                    html: '<!DOCTYPE html>' +
                        '<html><head><title>Reset Password</title>' +
                        '</head><body><div>' +
                        '<p>Dear ' + first_name + ' ' + last_name + ', There has been a request to reset password or unlock account for your Gark ID (' + email + '). To continue this process, enter the code below on the validation page:</p>' +
                        '<p>' + code + '</p>' +
                        '<p>Regards,</p>' +
                        '<p>Gark support</p>' +

                        '</div></body></html>'
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log(process.env.USER)
                        console.log('Email sent: ' + info.response);
                    }
                });
                response.status(200).json({ message: "verification code", code: code, email: email })
            }

        });

    },

    ResetPassword: (request, response) => {
        console.log('azeazeazeazeazeazeazeazeaz');
        var reqBody = request.body;

        var email = reqBody.email;
        var plaint_password = reqBody.password;


        userService.getAllUsers().then(function (result) {
            var validEmail = false;
            var current_user;

            result.forEach((user) => {
                if (!validEmail) {
                    if (user.email == email) {
                        validEmail = true;
                        current_user = user;
                    }
                }
            });

            if (!validEmail) {
                response.status(200).json({ message: "Error" });
                console.log('Error');
            } else {
                var hash_data = saltHashPassword(plaint_password);
                var password = hash_data.passwordHash; // Save password hash
                var salt = hash_data.salt; //save salt

                current_user.password = password;
                current_user.salt = salt;
                console.log('Password has been reset');
                response.status(200).json({ message: "Password has been reset" });
                userService.updateUser(current_user, current_user.id);
            }

        });
    }, UpdateUserPhoto: (request, response) => {
        var reqBody = request.body;

        var email = reqBody.user_email;
        var photo = reqBody.photo;

        userService.getUserByEmail(email).then(function (result) {
            result.photo = photo
            userService.updateUser(result, result.id)
            response.status(200).json({ message: "Done" });
        });
    },
    setAscompletedInformation: (request, response) => {
        var reqBody = request.body;

        var email = reqBody.email;
        userService.getUserByEmail(email).then(function (result) {
            result.completedInformation = true;
            userService.updateUser(result, result.id)
            response.status(200).json({ message: "Done" });
        });
    }, UpdateUser: (request, response) => {
        var reqBody = request.body;
        console.log(reqBody);
        var email = reqBody.user_email;
        var birth_date = reqBody.birth_date;
        var firstName = reqBody.firstName;
        var lastName = reqBody.lastName;
        var address = reqBody.address;
        var photo = reqBody.photo;
        var completedInformation = reqBody.completedInformation;
        console.log(completedInformation);
        if (completedInformation != null) {
            userService.getUserByEmail(email).then(function (result) {
                result.completedInformation = completedInformation
                result.birth_date = Date.parse(birth_date)
                result.firstName = firstName
                result.lastName = lastName
                if (photo != null) {
                    result.photo = photo
                }
                result.address = address
                userService.updateUser(result, result.id)
            });
        }
        /*if (birth_date!=null){
            userService.getUserByEmail(email).then(function (result) {
                result.birth_date = Date.parse(birth_date)
                userService.updateUser(result,result.id)
            });
        }


    if (firstName!=null && lastName!=null){
        userService.getUserByEmail(email).then(function (result) {
            result.firstName = firstName
            result.lastName = lastName
            userService.updateUser(result,result.id)
        });
    }

    if (photo!=null){
        console.log('photo not null');
        console.log(photo);
        userService.getUserByEmail(email).then(function (result) {
            result.photo = photo
            userService.updateUser(result,result.id)
        });
    }

    if (address!=null ){
        userService.getUserByEmail(email).then(function (result) {
            result.address = address
            userService.updateUser(result,result.id)
        });
    }*/

        response.status(200).json({ message: "Done" });
        //}
    }
}



var genRandomString = function (length) {
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
};

var sha512 = function (password, salt) {
    var hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt: salt,
        passwordHash: value
    };
};




///Function

function saltHashPassword(userPassword) {
    var salt = genRandomString(16); // create 16 random character
    var passwordData = sha512(userPassword, salt);
    return passwordData;
}
function sendVerificationMail(first_name, last_name, fullUrl, email, transporter) {
    console.log(fullUrl + " " + email);
    var mailOptions = {
        from: 'gark.assistance@gmail.com',
        to: email,
        subject: 'Gark! Verification Mail',
        text: 'That was easy!',
        html: '<!DOCTYPE html>' +
            '<html><head><title>Verification Mail</title>' +
            '</head><body><div>' +
            '<p>Dear ' + first_name + ' ' + last_name + ', Thank you for joining Gark community ! Please click this link to verify your account (' + fullUrl + ').</p>' +
            '<p>Regards,</p>' +
            '<p>Gark support</p>' +

            '</div></body></html>'
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}


function checkHashPassword(userPassword, salt) {
    var passwordData = sha512(userPassword, salt);
    return passwordData;
}

function gfg() {
    var minm = 100000;
    var maxm = 999999;
    return Math.floor(Math.random() * (maxm - minm + 1)) + minm;
}

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.email,
        pass: process.env.pass
    }
});
