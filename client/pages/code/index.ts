import { state } from "../../state";
import { Router } from "@vaadin/router";
const piedra = require("url:../../img/pngaaa.com-3313783.png");
const papel = require("url:../../img/pngaaa.com-3313779.png");
const tijera = require("url:../../img/pngaaa.com-3313815.png");

customElements.define(
  "code-page",
  class extends HTMLElement {
    connectedCallback() {
      this.render();
      const buttonNewRoom = this.querySelector(".seguir");
      buttonNewRoom.addEventListener("click", (e) => {
        Router.go("/instruccion");
      });
    }
    render() {
      const roomId = state.getState().roomId;

      this.innerHTML = `
      <div class="contenedor">
        <div class="elemento elemento1">
        <p class="texto">compartí el código con tu contrincante
        <br>${roomId}
        </p>
        
         </div>
     


      <div class="botones">
        <button class="seguir">SEGUIR</button>
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
