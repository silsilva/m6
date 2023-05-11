"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.realtimeDB = exports.rtdb = exports.firestore = void 0;
const admin = require("firebase-admin");
const firebaseKey = require("./firebase.json");
admin.initializeApp({
    credential: admin.credential.cert(firebaseKey),
    databaseURL: "https://cap2-f2deb-default-rtdb.firebaseio.com",
});
const firestore = admin.firestore();
exports.firestore = firestore;
const rtdb = admin.database();
exports.rtdb = rtdb;
const realtimeDB = admin.database();
exports.realtimeDB = realtimeDB;
