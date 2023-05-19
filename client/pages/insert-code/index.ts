import { state } from "../../state";
import { Router } from "@vaadin/router";
const piedra = require("url:../../img/pngaaa.com-3313783.png");
const papel = require("url:../../img/pngaaa.com-3313779.png");
const tijera = require("url:../../img/pngaaa.com-3313815.png");

customElements.define(
  "insert-code",
  class extends HTMLElement {
    connectedCallback() {
      this.render();
      const form = this.querySelector(".form");

      form.addEventListener("submit", (e: any) => {
        e.preventDefault();
        const code = e.target.code.value;
        const currentState = state.getState();
        currentState.roomId = code;
        state.setState(currentState);
        console.log(code);

        Router.go("/name");
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


      <form class="form">
        <label>ROOM</label>
        <input type="text" name="code" />
        <button class="comenzar">COMENZAR</button>
      </form>

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
