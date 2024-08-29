import { BreakItemSheet } from "./item-sheet.js";

export class BreakShieldSheet extends BreakItemSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["break", "sheet", "shield"],
      template: "systems/break/templates/items/kit-sheet.hbs",
      width: 600,
      height: 480,
      dragDrop: [{dragSelector: null, dropSelector: null}]
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  async getData(options) {
    const context = await super.getData(options);
    context.descriptionHTML = await TextEditor.enrichHTML(context.item.system.description, {
      secrets: this.document.isOwner,
      async: true
    });
    context.isShield = true;
    return context;
  }
}
