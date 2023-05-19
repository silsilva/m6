import { Router } from "@vaadin/router";
import { state } from "../../state";
const piedra = require("url:../../img/pngaaa.com-3313783.png");
const papel = require("url:../../img/pngaaa.com-3313815.png");
const tijera = require("url:../../img/pngaaa.com-3313779.png");

customElements.define(
  "home-page",
  class extends HTMLElement {
    connectedCallback() {
      this.render();
      const buttonNewRoom = this.querySelector(".nuevo");
      buttonNewRoom.addEventListener("click", (e) => {
        const cs = state.getState();
        state.setState(cs);
        Router.go("/name");
      });

      //Si elige room existente va a la pagina para ingresar el codigo /new-code
      const buttonExistentRoom = this.querySelector(".room");
      buttonExistentRoom.addEventListener("click", (e) => {
        const cs = state.getState();
        state.setState(cs);
        Router.go("/new-code");
      });
    }
    render() {
      this.innerHTML = `
   
  <div class="contenedor"> 

      <div class="elemento elemento1A">
        <p class="ppiedra">Piedra</p>
        <p class="ppapel">Papel o</p>
        <p class="ttijera">Tijera</p>
      </div>

     <div class="botones">
        <button class="nuevo">NUEVO</button>
        <button class="room">SALA</button>
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
