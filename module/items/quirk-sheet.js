import { BreakItemSheet } from "./item-sheet.js";

export class BreakQuirkSheet extends BreakItemSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["break", "sheet", "quirk"],
      template: "systems/break/templates/items/quirk-sheet.hbs",
      width: 580,
      height: 540,
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
    context.advantagesHTML = await TextEditor.enrichHTML(context.item.system.advantages, {
      secrets: this.document.isOwner,
      async: true
    });
    context.disadvantagesHTML = await TextEditor.enrichHTML(context.item.system.disadvantages, {
      secrets: this.document.isOwner,
      async: true
    });
    return context;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if ( !this.isEditable ) return;
  }

  /* -------------------------------------------- */

  /** @override */
  _getSubmitData(updateData) {
    let formData = super._getSubmitData(updateData);
    return formData;
  }
}
