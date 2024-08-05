/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class BreakItemSheet extends ItemSheet {

  _getHeaderButtons() {
    let buttons = super._getHeaderButtons();
    return [{
      label: "",
      class: "header-chat-button",
      icon: "fas fa-comment",
      onclick: ev => this._onChatButton(ev)
    }].concat(buttons);

  }

  _onChatButton(ev) {
    this.object.sendToChat();
  }

}
