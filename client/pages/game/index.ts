import { state } from "../../state";
import { Router } from "@vaadin/router";
const piedra = require("url:../../img/pngaaa.com-3313783.png");
const papel = require("url:../../img/pngaaa.com-3313815.png");
const tijera = require("url:../../img/pngaaa.com-3313779.png");

customElements.define(
  "game-page",
  class extends HTMLElement {
    connectedCallback() {
      this.render();

      const buttonPiedra = this.querySelector(".piedra");
      buttonPiedra.addEventListener("click", (e) => {
        play("piedra");
      });
      const buttonPapel = this.querySelector(".papel");
      buttonPapel.addEventListener("click", (e) => {
        play("papel");
      });
      const buttonTijera = this.querySelector(".tijera");
      buttonTijera.addEventListener("click", (e) => {
        play("tijera");
      });

      function play(opciones) {
        const cs = state.getState();
        const j1s = cs.currentGame.jugador1.name;
        const j2s = cs.currentGame.jugador2.name;
        if (j1s == cs.name) {
          state.setMove(opciones);
          state.pushMoveUno();
        }
        if (j2s == cs.name) {
          state.setMove2(opciones);
          state.pushMoveDos();
        }
      }
      setTimeout(() => {
        const cs = state.getState();
        const j1 = cs.currentGame.jugador1.choice;
        const j2 = cs.currentGame.jugador2.choice;
        if (j1 == "" || j2 == "") {
          state.cleanStartUno();
          state.clearStartDos();
          Router.go("/instruccion");
        } else {
          Router.go("/jugada");
        }
      }, 3000);
    }
    render() {
      this.innerHTML = `
      <div class="contenedor">
         
          
            <custom-countdown class= "time" count="3"></custom-countdown>
            
        


        <div class="elemento elemento5">
          <button type="button" class="piedra">
          <img class="img" src=${piedra} />
          </button>
          <button type="button" class="papel">
            <img class="img" src=${papel} />
          </button>
          <button type="button" class="tijera">
            <img class="img" src=${tijera}} />
          </button>
        </div>
     </div>     
  
          `;
    }
  }
);
