"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const db_1 = require("./db");
const uuid_1 = require("uuid");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());
const userCollection = db_1.firestore.collection("users");
const roomsCollection = db_1.firestore.collection("rooms");
app.post("/signup", (req, res) => {
    const nombre = req.body.nombre;
    userCollection
        .where("nombre", "==", nombre)
        .get()
        .then((searchRes) => {
        if (searchRes.empty) {
            userCollection
                .add({
                nombre,
            })
                .then((newUserRef) => {
                res.json({ id: newUserRef.id, new: true });
            });
        }
        else {
            res.json({ id: searchRes.docs[0].id, new: false });
        }
    });
});
//Crea un room
app.post("/rooms", (req, res) => {
    const { userId, name } = req.body;
    userCollection
        .doc(userId.toString())
        .get()
        .then((doc) => {
        if (doc.exists) {
            const roomRef = db_1.rtdb.ref(`rooms/${(0, uuid_1.v4)()}`);
            roomRef
                .set({
                currentGame: {
                    jugador1: {
                        userId,
                        name,
                        choice: "",
                        online: true,
                        start: false,
                    },
                },
            })
                .then(() => {
                const roomLongId = roomRef.key;
                const roomId = 1000 + Math.floor(Math.random() * 999);
                roomsCollection
                    .doc(roomId.toString())
                    .set({
                    rtdbRoomId: roomLongId,
                })
                    .then(() => {
                    res.json({
                        id: roomId.toString(),
                    });
                });
            });
        }
        else {
            res.status(401).json({
                message: "no existis",
            });
        }
    });
});
app.get("/rooms/:roomId", (req, res) => {
    const { userId } = req.query;
    const { roomId } = req.params;
    userCollection
        .doc(userId.toString())
        .get()
        .then((doc) => {
        if (doc.exists) {
            const room = roomsCollection.doc(roomId.toString()).get();
            room.then((snap) => {
                const data = snap.data();
                res.json(data);
            });
        }
        else {
            res.status(401).json({
                message: "no existis",
            });
        }
    });
});
app.post("/rooms/jugador2", (req, res) => {
    const { userId, name, roomId, rtdbId } = req.body;
    const roomRef = db_1.rtdb.ref(`rooms/${rtdbId}/currentGame/`);
    roomRef
        .update({
        jugador2: {
            userId,
            name,
            choice: "",
            online: true,
            start: false,
        },
    })
        .then(() => {
        res.status(200).json("ok");
    });
});
app.post("/info/:rtdbId", (req, res) => {
    const { rtdbId } = req.params;
    const roomRef = db_1.rtdb.ref(`rooms/${rtdbId}/currentGame/jugador1`);
    roomRef.update(req.body, function (err) {
        console.log(err);
        res.json("okk");
    });
});
app.post("/info/jugador2/:rtdbId", (req, res) => {
    const { rtdbId } = req.params;
    const roomRef = db_1.rtdb.ref(`rooms/${rtdbId}/currentGame/jugador2`);
    roomRef.update(req.body, function (err) {
        console.log(err);
        res.json("ok");
    });
});
app.get("/jugadores/:rtdbId", (req, res) => {
    const { rtdbId } = req.params;
    const referencia = db_1.rtdb.ref(`/rooms/${rtdbId}/currentGame`);
    referencia.once("value", (snap) => {
        const contenido = snap.val();
        res.status(200).json(contenido);
    });
});
app.use(express.static("dist"));
app.get("*", (req, res) => {
    res.sendFile(__dirname + "./dist/index.html");
}),
    app.listen(port, () => {
        console.log("Escuchando en el puerto: " + port);
    });
