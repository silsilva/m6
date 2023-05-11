import * as admin from "firebase-admin";
import * as firebaseKey from "./firebase.json";

admin.initializeApp({
  credential: admin.credential.cert(firebaseKey as any),
  databaseURL: "https://cap2-f2deb-default-rtdb.firebaseio.com",
});
const firestore = admin.firestore();
const rtdb = admin.database();
const realtimeDB = admin.database();

export { firestore, rtdb, realtimeDB };
