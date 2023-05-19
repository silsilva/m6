import { state } from "../../state";
import { Router } from "@vaadin/router";

const empate = require("url:../../img/empate.png");
const ganado = require("url:../../img/ganador.png");
const perdedor = require("url:../../img/perdedor.png");

customElements.define(
  "result-page",
  class extends HTMLElement {
    connectedCallback() {
      this.render();
      const buttonNewRoom = this.querySelector(".volver");
      buttonNewRoom.addEventListener("click", (e) => {
        state.cleanStartUno();
        state.clearStartDos();
        state.clearChoiceUno();
        state.clearChoiceDos();

        Router.go("/instruccion");
      });
    }

    resultado(calcResult, name, p1, p2) {
      if (calcResult == "empate") return empate;
      if (calcResult == "gano j1" && name == p1) return ganado;
      if (calcResult == "gano j2" && name == p2) return ganado;
      if (calcResult == "gano j1" && name == p2) return perdedor;
      if (calcResult == "gano j2" && name == p1) return perdedor;
    }

    render() {
      const p1 = state.getState().currentGame.jugador1.name;
      const p2 = state.getState().currentGame.jugador2.name;

      const name = state.getState().name;

      const j1 = state.getState().currentGame.jugador1.choice;
      const j2 = state.getState().currentGame.jugador2.choice;

      const juego = state.calcResult(j1, j2);
      const puntos1 = state.getState().puntos.puntosJ1;
      const puntos2 = state.getState().puntos.puntosJ2;
      const calcular = state.calcResult(j1, j2);
      const mostrar = this.resultado(calcular, name, p1, p2);
      var style = document.createElement("style");
      this.innerHTML = `
      <div class="contenedor">
          <div class="elemento elemento1">
             <img class="estrella" src=${mostrar} />
          </div>


          <div class="score">
          <h3 class="sscore">SCORE</h3>
            <p class="sscore">${p1}:${puntos1}</p>
            <p class="sscore">${p2}:${puntos2}</p> 
          </div>



          <div class="botones">
            <button class="volver">JUGAR!</button>
          </div>
    </div>
        `;
      if (mostrar == ganado) {
        style.textContent = `
      .contenedor{
        background:linear-gradient(to right, #2962ff, #BBDEFB);
      }
     
      `;
      }

      if (mostrar == perdedor) {
        style.textContent = `
      .contenedor{
        background:linear-gradient(to right, #D50000, #FFCDD2);
      }
      
      `;
      }

      if (mostrar == empate) {
        style.textContent = `
      .contenedor{
        background:linear-gradient(to right, #d9ad26, #EFE670);
      }
      
      `;
      }

      this.appendChild(style);
    }
  }
);
