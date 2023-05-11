import { Router } from "@vaadin/router";
import { state } from "../state";

class Home extends HTMLElement {
  connectedCallback() {
    this.render();
    const form = this.querySelector(".form");
    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const currentState = state.getState();
      const target = e.target as any;
      const NOMBRE = target.nombre.value;
      const sala = target.sala.value;
      currentState.roomId = sala;
      state.setState(currentState);

      state.setNombre(NOMBRE);
      console.log(target.nombre.value);
      if (sala == "") {
        state.signIn((err) => {
          if (err) console.log("HUBO UN ERROR EN EL SIGNIN");
          state.askNewRoom(() => {
            state.accessToRoom();
          });
        });
      }
      if (currentState.roomId) {
        state.setNombre(NOMBRE);
        state.accessToRoom();
      }

      Router.go("/chat");
    });
  }
  render() {
    this.innerHTML = `
        
        <form class="form">
        <div>
        <label>Tu nombre</label>
        </div>
        <input type="text" name="nombre">
        <div>
        <label>SALA</label>
        </div>
        <input type="text" name="sala">
        <button>COMENZAR</button>
        </form>
        
        `;
  }
}
customElements.define("home-page", Home);
