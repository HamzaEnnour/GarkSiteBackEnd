/* FireBase */
var admin = require("firebase-admin");
var serviceAccount = require("../firebase_service_key.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://garktn-default-rtdb.europe-west1.firebasedatabase.app"
});
const firestore = admin.firestore();
/* FireBase */

module.exports = {
    admin,
    firestore
}