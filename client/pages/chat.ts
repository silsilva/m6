import { state } from "../state";

type Message = {
  from: string;
  message: string;
};

class ChatPage extends HTMLElement {
  connectedCallback() {
    state.subscribe(() => {
      const currentState = state.getState();
      this.messages = currentState.messages;
      this.render();
    });

    this.render();
  }

  messages: Message[] = [];
  addListeners() {
    const form = this.querySelector(".submit-message");
    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const target = e.target as any;
      let mensage = target["new-message"].value;

      console.log(mensage);

      state.pushMessage(mensage);
      console.log(target["new-message"].value);
    });
  }
  render() {
    const currentState = state.getState();
    this.innerHTML = `
   
    <h1>CHAT</h1>
    <div class="chat"> RoomId: ${currentState.roomId}
    <div class="messages">
    ${this.messages
      .map((m) => {
        return `<div class="message">${m.from}:${m.message}</div>`;
      })
      .join("")}
    
    </div>
    <form class="submit-message">
    <input type="text" name="new-message">
    <button>ENVIAR</button>
    </form>
    </div>
    
    `;

    this.addListeners();
  }
}
customElements.define("chat-page", ChatPage);
