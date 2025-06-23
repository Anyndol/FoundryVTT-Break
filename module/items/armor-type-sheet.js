import { BreakItemSheet } from "./item-sheet.js";

export class BreakArmorTypeSheet extends BreakItemSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["break", "sheet", "armor-type"],
      template: "systems/break/templates/items/armor-type-sheet.hbs",
      width: 600,
      height: 480,
      dragDrop: [{dragSelector: null, dropSelector: null}]
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  async getData(options) {
    const context = await super.getData(options);
    context.descriptionHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(context.item.system.description, {
      secrets: this.document.isOwner,
      async: true
    });
    context.abilities = context.item.system.abilities ?? [];
    return context;
  }
  /* -------------------------------------------- */

  /** @inheritdoc */
    activateListeners(html) {
        super.activateListeners(html);

        if ( !this.isEditable ) return;
        html.find(".delete-ability").on("click", this.item.onDeleteAbility.bind(this));
    }

  /** @inheritdoc */
    async _onDrop(event) {
        const data = foundry.applications.ux.TextEditor.implementation.getDragEventData(event);
        if(data.type !== "Item") return;
        const draggedItem = await fromUuid(data.uuid)
        if(draggedItem.type === "ability" && draggedItem.system.subtype === "armor") {
            const abilityArray = this.item.system.abilities ?? [];
            abilityArray.push(draggedItem.toObject());
            this.item.update({"system.abilities": abilityArray});
        }
    }

  /* -------------------------------------------- */

  /** @override */
  _getSubmitData(updateData) {
    let formData = super._getSubmitData(updateData);
    return formData;
  }
}
