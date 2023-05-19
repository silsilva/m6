import { Router } from "@vaadin/router";
import { state } from "../../state";
const piedra = require("url:../../img/pngaaa.com-3313783.png");
const papel = require("url:../../img/pngaaa.com-3313815.png");
const tijera = require("url:../../img/pngaaa.com-3313779.png");

customElements.define(
  "name-page",
  class extends HTMLElement {
    connectedCallback() {
      const rtdbRoomId = state.getState().rtdbRoomId;
      this.render();
      const form = this.querySelector(".form");
      form.addEventListener("submit", (e: any) => {
        e.preventDefault();
        const nombre = e.target.nombre.value;
        const currentState = state.getState();

        state.signIn(nombre).then(() => {
          console.log(nombre);

          if (currentState.roomId == "") {
            state.askNewRoom(() => {
              state.accessToRoom().then(() => {
                Router.go("/codigo");
              });
            });
          } else {
            state.accessToRoom().then(() => {
              console.log(state.getState().rtdbRoomId);
              state.informacion(state.getState().rtdbRoomId).then((v) => {
                const p1 = v.jugador1.name;
                console.log("HOLA", p1);
                if (v.jugador2 == undefined && nombre !== v.jugador1.name) {
                  state.jugadorDos(() => {
                    Router.go("/instruccion");
                  });
                } else if (
                  nombre == v.jugador1.name ||
                  nombre == v.jugador2.name
                ) {
                  Router.go("/instruccion");
                } else if (
                  nombre != v.jugador1.name ||
                  nombre != v.jugador2.name
                ) {
                  alert("ERROR, tu nombre no coincide con nadie en la sala. ");
                }
              });
            });
          }
        });
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
           <label>NOMBRE</label>
           <input type="text" name="nombre" />
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
               <img src=${tijera}} />
             </button>
           </div>
       
        
     </div>
        `;
    }
  }
);
