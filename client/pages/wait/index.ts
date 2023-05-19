import { state } from "../../state";
import { Router } from "@vaadin/router";
const piedra = require("url:../../img/pngaaa.com-3313783.png");
const papel = require("url:../../img/pngaaa.com-3313815.png");
const tijera = require("url:../../img/pngaaa.com-3313779.png");

customElements.define(
  "wait-page",
  class extends HTMLElement {
    connectedCallback() {
      state.subscribe(() => {
        const cs = state.getState();
        const j1s = cs.currentGame.jugador1.start;
        const j2s = cs.currentGame.jugador2.start;
        if (j1s == true && j2s == true) {
          Router.go("/juego");
        } else {
          this.render();
        }
      });
      this.render();
    }
    who(miNombre, p1, p2) {
      if (miNombre == p1) return p2;
      else return p1;
    }
    render() {
      const miNombre = state.getState().name;
      const roomId = state.getState().roomId;
      const p1 = state.getState().currentGame.jugador1.name;
      const p2 = state.getState().currentGame.jugador2.name;
      const puntos1 = state.getState().puntos.puntosJ1;
      const puntos2 = state.getState().puntos.puntosJ2;
      const esperandoA = this.who(miNombre, p1, p2);
      this.innerHTML = `
      <div class="contenedor">
      <div class="encabezado">
        <div class="iz">
          <h4>${p1}:${puntos1}</h4>
          <h4>${p2}:${puntos2}</h4>
        </div>
        <div class="der">
          <h4>codigo:${roomId}</h4>
        </div>
      </div>


      <div class="elemento elemento1">
        <p class="texto">Esperando a que  ${esperandoA}  presione ¡jugar!</p>
      </div>

    <div class="elemento elemento5">
      <button type="button" class="piedra">
      <img src=${piedra} />
      </button>
      <button type="button" class="papel">
        <img src=${papel} />
      </button>
      <button type="button" class="tijera">
        <img src=${tijera} />
      </button>
    </div>



  </div>

       
            `;
    }
  }
);
