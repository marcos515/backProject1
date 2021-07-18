const firebase = require('firebase');
require("dotenv").config();

let app = firebase.initializeApp({
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    databaseURL: process.env.databaseURL,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
    measurementId: process.env.measurementId
});

function setApiHost(api) {
    var database = firebase.database();
    database.ref("apiHost").set(api).then(res => {
        console.log("apiHost published")
    });
}

module.exports = {
    setApiHost
}