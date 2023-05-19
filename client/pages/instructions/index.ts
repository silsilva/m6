import { state } from "../../state";
import { Router } from "@vaadin/router";
const piedra = require("url:../../img/pngaaa.com-3313783.png");
const papel = require("url:../../img/pngaaa.com-3313815.png");
const tijera = require("url:../../img/pngaaa.com-3313779.png");

customElements.define(
  "instructions-page",
  class extends HTMLElement {
    connectedCallback() {
      this.render();
      const buttonNewRoom = this.querySelector(".seguir");
      buttonNewRoom.addEventListener("click", (e) => {
        const cs = state.getState();
        const j1 = cs.currentGame.jugador1.name;
        if (j1 == cs.name) {
          state.startUno();
        } else {
          state.startDos();
        }
        state.setState(cs);
        console.log(cs.name);
        console.log(j1);
        Router.go("/esperar");
      });
    }
    render() {
      this.innerHTML = `
    <div class="contenedor">
        <div class="elemento elemento1">
          <p class="texto">
          presiona jugar y elegí: piedra, papel o tijera antes de que pasen los
          3 segundos
          </p>
      
        </div>
   


        <div class="botones">
          <button class="seguir">JUGAR!</button>
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
