const API_BASE_URL = "http://localhost:3000";
import { rtdb } from "./rtdb";
import map from "lodash/map";
type Message = {
  from: string;
  message: string;
};
const state = {
  data: {
    email: "",
    nombre: "",
    fullName: "",
    userId: "",
    roomId: "",
    messages: [],
    rtdbRoomId: "",
  },
  listeners: [],
  init() {
    const lastStorageState = localStorage.getItem("state");
  },
  listenRoom() {
    const currentState = this.getState();

    const chatroomsRef = rtdb.ref("/rooms/" + currentState.roomId);
    //const chatroomsRef = rtdb.ref("/rooms/1019" + roomId);

    chatroomsRef.on("value", (snapshot) => {
      const messagesFromServer = snapshot.val();
      const messagesList = map(messagesFromServer.messages);

      currentState.messages = messagesList;
      this.setState(currentState);
      console.log(currentState.roomId);
    });
  },
  getState() {
    return this.data;
  },
  getStateUserName() {
    return this.nombre;
  },
  setNombre(nombre: string) {
    const currentState = this.getState();
    currentState.nombre = nombre;
    this.setState(currentState);
  },
  setState(newState) {
    this.data = newState;
    for (const cb of this.listeners) {
      cb();
    }
    localStorage.setItem("state", JSON.stringify(newState));
    console.log("soy el state, he cambiado", this.data);
  },
  signIn(callback) {
    const cs = this.getState();
    if (cs.nombre) {
      fetch(API_BASE_URL + "/signup", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ nombre: cs.nombre }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          cs.userId = data.id;
          this.setState(cs);
          callback();
        });
    } else {
      console.error("NO HAY UN EMAIL EN EL STATE");
      callback(true);
    }
  },
  askNewRoom(callback?) {
    const cs = this.getState();
    if (cs.userId) {
      console.log(cs.userId);
      fetch(API_BASE_URL + "/rooms", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ userId: cs.userId }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          cs.roomId = data.id;
          this.setState(cs);
          if (callback) {
            callback();
          }
        });
      console.log(cs.userId);
    } else {
      console.error("NO HAY USER ID");
    }
  },
  //

  //NUEVO
  accessToRoom(callback?) {
    const cs = this.getState();
    const roomId = cs.roomId;
    fetch(API_BASE_URL + "/rooms/" + roomId + "?userId=" + cs.userId)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        cs.rtdbRoomId = data.rtdbRoomId;
        this.setState(cs);
        this.listenRoom();
        if (callback) callback();
      });
  },
  pushMessage(message: string) {
    const currentState = this.getState();
    //ACA ESTA EL TEMA
    fetch(API_BASE_URL + "/rooms/" + currentState.roomId, {
      //fetch(API_BASE_URL + "/messages", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: this.data.nombre,
        message: message,
      }),
    });
  },
  subscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },
};
export { state };
