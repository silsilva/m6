const API_BASE_URL = "https://subir.onrender.com";

import { rtdb } from "./rtdb";
import map from "lodash/map";
const state = {
  data: {
    currentGame: "",
    name: "",
    userId: "",
    roomId: "",
    rtdbRoomId: "",
    puntos: {
      puntosJ1: 0,
      puntosJ2: 0,
    },
  },
  listeners: [],

  listenRoom() {
    const currentState = this.getState();
    const roomRef = rtdb.ref("/rooms/" + currentState.rtdbRoomId);
    roomRef.on("value", (snap) => {
      const cs = this.getState();
      const data = snap.val();
      cs.currentGame = data.currentGame;
      this.setState(cs);
    });
  },

  getState() {
    return this.data;
  },

  signIn(name: string) {
    const cs = this.getState();
    cs.name = name;
    if (name) {
      return fetch(`${API_BASE_URL}/signup`, {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ nombre: name }),
      })
        .then((res) => res.json())
        .then((data) => {
          cs.userId = data.id;
          this.setState(cs);
        });
    } else {
      console.error("No ingresaste un name");
    }
  },

  jugadorDos(callback?) {
    const cs = this.getState();
    fetch(API_BASE_URL + "/rooms/jugador2", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        userId: cs.userId,
        name: cs.name,
        roomId: cs.roomId,
        rtdbId: cs.rtdbRoomId,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        if (callback) {
          this.setState(cs);
          callback();
        }
      });
  },

  startUno() {
    const cs = this.getState();
    fetch(API_BASE_URL + "/info/" + cs.rtdbRoomId, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        start: true,
      }),
    });
  },

  cleanStartUno() {
    const cs = this.getState();
    fetch(API_BASE_URL + "/info/" + cs.rtdbRoomId, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        start: false,
      }),
    });
  },

  startDos() {
    const cs = this.getState();
    fetch(API_BASE_URL + "/info/jugador2/" + cs.rtdbRoomId, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        start: true,
      }),
    });
  },

  clearStartDos() {
    const cs = this.getState();
    fetch(API_BASE_URL + "/info/jugador2/" + cs.rtdbRoomId, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        start: false,
      }),
    });
  },
  clearChoiceDos() {
    const cs = this.getState();
    fetch(API_BASE_URL + "/info/jugador2/" + cs.rtdbRoomId, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        choice: "",
      }),
    });
  },
  clearChoiceUno() {
    const cs = this.getState();
    fetch(API_BASE_URL + "/info/" + cs.rtdbRoomId, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        choice: "",
      }),
    });
  },

  setMove(choice) {
    const cs = this.getState();
    cs.currentGame.jugador1.choice = choice;
    this.setState(cs);
  },

  pushMoveUno() {
    const cs = this.getState();
    fetch(API_BASE_URL + "/info/" + cs.rtdbRoomId, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        choice: cs.currentGame.jugador1.choice,
      }),
    });
  },

  setMove2(choice) {
    const cs = this.getState();
    cs.currentGame.jugador2.choice = choice;
    this.setState(cs);
  },

  pushMoveDos() {
    const cs = this.getState();
    fetch(API_BASE_URL + "/info/jugador2/" + cs.rtdbRoomId, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        choice: cs.currentGame.jugador2.choice,
      }),
    });
  },

  informacion(rtdbRoomId) {
    const cs = this.getState();
    return fetch(API_BASE_URL + "/jugadores/" + rtdbRoomId, {
      method: "get",
    }).then((res) => {
      return res.json().then((data) => {
        return data;
      });
    });
  },
  askNewRoom(callback?) {
    const cs = this.getState();
    if (cs.userId) {
      fetch(API_BASE_URL + "/rooms", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ userId: cs.userId, name: cs.name }),
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
    } else {
      console.error("no hay userId");
    }
  },

  calcResult(j1, j2) {
    if (j1 === j2) {
      return "empate";
    } else if (j1 === "piedra") {
      if (j2 === "papel") return "gano j2";
      if (j2 === "tijera") return "gano j1";
    } else if (j1 === "papel") {
      if (j2 === "tijera") return "gano j2";
      if (j2 === "piedra") return "gano j1";
    } else if (j1 === "tijera") {
      if (j2 === "piedra") return "gano j2";
      if (j2 === "papel") return "gano j1";
    }
  },

  pushGanador(who: string) {
    const cs = this.getState();
    if (who == "gano j1") {
      cs.puntos.puntosJ1 += 1;
      return "jugador1";
    }
    if (who == "gano j2") {
      cs.puntos.puntosJ2 += 1;
      return "jugador2";
    }
    this.setState(cs);
    console.log(cs);
  },

  puntos2() {
    const cs = this.getState();
    fetch(API_BASE_URL + "/info/jugador2/" + cs.rtdbRoomId, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        puntos: cs.currentGame.jugador2.puntos,
      }),
    });
  },

  accessToRoom() {
    const cs = this.getState();
    const roomId = cs.roomId;
    return fetch(API_BASE_URL + "/rooms/" + roomId + "?userId=" + cs.userId)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        cs.rtdbRoomId = data.rtdbRoomId;
        this.setState(cs);
        this.listenRoom();
      });
  },
  getData() {
    const localData = localStorage.getItem("state");
    const localDataParse = JSON.parse(localData);
    if (localDataParse == null) {
      const currentState = this.getState();
      this.setState(currentState);
    } else {
      this.setState(localDataParse);
    }
  },

  setState(newState) {
    this.data = newState;
    for (const cb of this.listeners) {
      cb();
    }
    localStorage.setItem("state", JSON.stringify(newState));
    console.log("SOY STATE", this.data);
  },

  subscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },
};

export { state };
