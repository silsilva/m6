import * as express from "express";
import { firestore, rtdb } from "./db";
import { v4 as uuidv4 } from "uuid";
import * as path from "path";
import { json } from "body-parser";
import * as cors from "cors";

const app = express();

const port = 3000;
app.use(express.json());
app.use(cors());

const userCollection = firestore.collection("users");
const roomsCollection = firestore.collection("rooms");
app.get("/hola", (req, res) => {
  res.json({
    message: "HOLA MUNDO, DESDE EL SERVIDOR",
  });
});
app.get("/env", (req, res) => {
  res.json({
    environment: process.env.AUTH_DOMAIN,
  });
});
app.post("/signup", (req, res) => {
  const nombre = req.body.nombre;
  userCollection
    .where("nombre", "==", nombre)
    .get()
    .then((searchResponse) => {
      if (searchResponse.empty) {
        userCollection
          .add({
            nombre,
          })
          .then((newUserRef) => {
            res.json({
              id: newUserRef.id,
              new: true,
            });
          });
      } else {
        res.json({
          id: searchResponse.docs[0].id,
        });
      }
    });
});

app.post("/rooms", (req, res) => {
  const { userId } = req.body;
  userCollection
    .doc(userId.toString())
    .get()
    .then((doc) => {
      if (doc.exists) {
        const roomsRef = rtdb.ref("rooms/" + uuidv4());
        roomsRef
          .set({
            owner: userId,
          })
          .then(() => {
            const roomLongId = roomsRef.key;
            const roomId = 1000 + Math.floor(Math.random() * 999);
            roomsCollection
              .doc(roomId.toString())
              .set({
                rtdbRoomId: roomLongId,
                owner: userId,
                messages: [],
              })
              .then(() => {
                res.json({
                  id: roomId.toString(),
                });
              });
          });
      } else {
        res.status(401).json({
          message: "NO EXISTIS",
        });
      }
    });
});

app.get("/rooms/:roomId", (req, res) => {
  const { userId } = req.query;
  const { roomId } = req.params;

  roomsCollection
    .doc(roomId)
    .get()
    .then((userSnap) => {
      const userData = userSnap.data();
      res.json(userData);
      //res.json(userData.rtdbRoomId);
    });
});

app.post("/rooms/:id", function (req, res) {
  const { id } = req.params;
  const chatRoomRef = rtdb.ref("/rooms/" + `${id}` + "/messages");
  chatRoomRef.push(req.body, function () {
    res.json("todo ok");
  });
});
app.use(express.static("dist"));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./dist/index.html"));
});
app.listen(port, () => {
  console.log(
    `aplicacion de ejemplo escuchando en el puerto http://localhost:${port}`
  );
});
