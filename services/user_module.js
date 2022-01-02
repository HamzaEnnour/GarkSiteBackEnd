const userSchema = require('../models/user')

var mongodb = require('mongodb');
var firestoreConfig = require('../config/firestoreConfig');
var ObjectID = mongodb.ObjectID;
var crypto = require('crypto');
//var bodyParser = require("body-parser");
var CryptoJS = require("crypto-js");
const ejs = require('ejs');


const notification_observer = firestoreConfig.firestore.collection('chatroom')
    .onSnapshot(async querySnapshot => {
        querySnapshot.docChanges().forEach(async change => {

            if (change.type === 'modified') {

                var users = change.doc.data()['users'];
                const userList = change.doc.data()['users'];
                var userFrom;
                var msgValue;
                var msgDate;
                var seenBy;



                const msgRef = firestoreConfig.firestore.collection('chatroom').doc(change.doc.id).collection('messages').doc(change.doc.data()['lastMsgDocumentRefId']);
                const msgDoc = await msgRef.get();

                if (!msgDoc.exists) {

                } else {

                    userFrom = msgDoc.data()['from'];
                    msgValue = msgDoc.data()['msg'];
                    msgDate = msgDoc.data()['date'];
                    seenBy = msgDoc.data()['seenBy'];
                    users = users.filter(e => e !== userFrom);

                    //console.log(users);
                    //console.log(seenBy);
                }

                if (seenBy.length == 0) {
                    const uList = []; 
                    userList.forEach(async (u) =>  {
                        uList.push(JSON.stringify(await userSchema.findOne({ '_id': u })));
                    });

                    const notification_options = {
                        priority: "high",
                        timeToLive: 60 * 60 * 24
                    };

                    users.forEach(async (user) => {
                        const userRef = firestoreConfig.firestore.collection('users').doc(user);
                        const userFCMToken = (await userRef.get()).data()['fcmToken'];

                        const msgFromUser = await userSchema.findOne({ '_id': userFrom });

                        console.log('sending notif to', user);
                        console.log('from ', userFrom);
                        console.log('msgValue ', msgValue);
                        console.log('msgDate ', msgDate);

                        var obj = new Object();
                        obj.msgValue = msgValue;
                        obj.chatroomId = change.doc.id;
                        obj.image = msgFromUser.photo;
                        obj.from = msgFromUser.firstName + " " + msgFromUser.lastName;
                        var jsonString = JSON.stringify(obj);

                        const message = {
                            notification: {
                                title: obj.from,
                                body: obj.msgValue,
                                //imageUrl: msgFromUser.photo,
                              },
                            token: userFCMToken,
                            data: {
                                body: jsonString,
                                click_action: "FLUTTER_NOTIFICATION_CLICK",
                                status: "done",
                                userList:JSON.stringify(uList)
                            }

                        }

                        try {
                            firestoreConfig.admin.messaging().send(message)
                                .then(response => {
                                    console.log('Notification sent successfully');

                                })
                                .catch(error => {
                                    console.log(error);
                                });
                        } catch (e) {
                            console.log(e);
                        }

                    }



                    );
                }

            }

        });
    });

module.exports = {
    notification_observer,
    //verifyMailById
    verifyMailById: async (id, response) => {
        await userSchema.findByIdAndUpdate({ _id: id }, { activation: true })
        response.status(201).json("Gark :Your account is now activated ! Welcome");
    },
    //Register(plaint_password,firstName,lastName,email,address,phone,response,request,transporter)
    Register: async (plaint_password, firstName, lastName, email, address, phone, birth_date, response, req, transporter) => {
        var hash_data = saltHashPassword(plaint_password);
        var password = hash_data.passwordHash; // Save password hash
        var salt = hash_data.salt; //save salt

        var user = {
            'firstName': firstName,
            'lastName': lastName,
            'email': email,
            'password': password,
            'salt': salt,
            'address': address,
            'phone': phone,
            'birth_date': birth_date,
            'score': 0,
            'signed_up_with': "Gark application"
            //'signed_up_date' : date
        };
        console.log(user);


        await new userSchema(user).save(async (err, result) => {
            if (err) {
                console.log(err);
                // response.status(404).json({message:"Registration failed"});
            } else {
                var fullUrl = req.protocol + '://' + req.get('host') + '/verifyMail/' + result._id;
                sendVerificationMail(result.firstName, result.lastName, fullUrl, result.email, transporter);
                console.log(typeof result);

                await firestoreConfig.firestore
                    .collection("users")
                    .doc(String(result._id))
                    .set({
                        'chatrooms': [], "isLoggedIn": false
                    })
                    .then(function (docRef) {
                        //console.log("Document written");
                    })
                    .catch(function (error) {
                        console.error("Error adding document: ", error);
                    });

                response.status(201).json("Registration success");
            }
        });

    },
    Login: async (response) => {
        //response.json('Login success');
        response.status(200).json({ message: "Login success" });
        console.log('Login success');
    },
    generateActivationToken : () => {
        return crypto.randomBytes(64).toString('base64');
    },
    cryptUrl: async (plainUrl) => {
        if (plainUrl == null || plainUrl == undefined) {
            return null;
        }

        var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(plainUrl), "ea5179d111736fa9f65eb0b90adc5d174c06b6b653a4864918be25e8dd6fyhf5339bc96ec09d58d9c39cd88b413985d559cccb43515359daa432faf1095c54175b7fc").toString();
        // var crypted = ciphertext.update()
        ciphertext = ciphertext.toString().replace(/\+/g,'p1L2u3S').replace(/\//g,'s1L2a3S4h').replace(/=/g,'e1Q2u3A4l');
        // var cipher = crypto.createCipher(cryptCredentials.algorithm, cryptCredentials.password);
        // var crypted = cipher.update(plainUrl, 'utf8', 'hex')
        // crypted += cipher.final('hex');
        return ciphertext;
    },
    decryptUrl: async (encryptedUrl) => {
        if (encryptedUrl == null || encryptedUrl == undefined) {
            return null;
        }

        encryptedUrl = encryptedUrl.replace(/p1L2u3S/g, '+' ).replace(/s1L2a3S4h/g, '/').replace(/e1Q2u3A4l/g, '=');
        try {
            const bytes = CryptoJS.AES.decrypt(encryptedUrl, "ea5179d111736fa9f65eb0b90adc5d174c06b6b653a4864918be25e8dd6fyhf5339bc96ec09d58d9c39cd88b413985d559cccb43515359daa432faf1095c54175b7fc");
            if (bytes.toString()) {
              return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            }
            return data;

          } catch (e) {
              return "";
          }
        // var decipher = crypto.createDecipher(cryptCredentials.algorithm, cryptCredentials.password);
        // var dec = decipher.update(encryptedUrl, 'hex', 'utf8')
        // dec += decipher.final('utf8');
        // return dec;
    },
    sendResetPasswordLink: async(user, url, clb,transporter) => {
        const fullName = `${user.firstName} ${user.lastName}`;
        ejs.renderFile(__dirname + "/../mail/resetPassword.ejs", { name: fullName, link: url }, (err, data) => {
            if (err) {
                console.log("error rendering ejs file", err);
                 clb({ Error: "Internal Error" })
            }else{
                const mailOptions = {
                    from: "gark.assistance@gmail.com",
                    to: user.email,
                    subject: "Gark! Reset password",
                    html: data
                };
    
                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        clb({Error : "Error sending the email"})
                    }else{
                        return clb({ Message: "sent", info });
                    }
                    
                });
            }
            
        })
    },
    getAllUsers: async () => {
        //console.log('get all users !')
        return users = await userSchema.find({})
    },
    getAllUsersByEmail: async (email) => {
        //console.log('get all users by email !');
        return users = await userSchema.find({ 'email': email }).countDocuments();
    },
    getAllUsersByPhone: async (phone) => {
        //console.log('get all users by phone !');
        try {
            return users = await userSchema.find({ 'phone': phone });
        } catch (err) {
            return 'error occured';
        }
    }, getUserByEmail: async (email) => {
        //console.log('get user by email !');
        return user = await userSchema.findOne({ 'email': email });
    }, getUserById: async (id) => {
        //console.log('get user by email !');
        return user = await userSchema.findOne({ '_id': id });
    },
    updateUser: async (user, id) => {
        user.completedInformation = true;
        delete user["wallet"];
        delete user["blackListed"];
        delete user["role"];
        await userSchema.findByIdAndUpdate({ _id: id }, user)
        console.log('user updated successfully in mongoDB !')
    },
    RegisterFb: async (first_name, last_name, email, signed_up_with, birth_date, photo) => {
        var user = {
            'firstName': first_name,
            'lastName': last_name,
            'email': email,
            'score': 0,
            'signed_up_with': signed_up_with,
            'birth_date': birth_date,
            'photo': photo
        };

        await new userSchema(user).save()

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