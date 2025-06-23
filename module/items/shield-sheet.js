import { BreakItemSheet } from "./item-sheet.js";

export class BreakShieldSheet extends BreakItemSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["break", "sheet", "shield"],
      template: "systems/break/templates/items/shield-sheet.hbs",
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
    context.isShield = true;
    return context;
  }

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
    if(draggedItem.type === "shield-type") {
      if(event.target.id === "shieldtype" ){
        const prunedAbilities = this.item.mergeAndPruneAbilities(draggedItem.system.abilities ?? []);
        await this.item.update({"system.type": draggedItem.toObject(), "system.abilities": prunedAbilities});
        this._onSetShieldType();
      }
    } else if(draggedItem.type === "ability" && draggedItem.system.subtype === "shield") {
      const abilityArray = this.item.system.abilities ?? [];
      abilityArray.push(draggedItem.toObject());
      this.item.update({"system.abilities": abilityArray});
    }
  }

  _onSetShieldType() {
    const shieldType = this.item.system.type?.system;
    const updates = {};
    if(shieldType.speedPenalty != null) {
      updates["system.speedPenalty"] = shieldType.speedPenalty;
    }
    updates["system.defenseBonus"] = shieldType.defenseBonus;
    updates["system.slots"] = shieldType.slots;
    updates["system.value"] = shieldType.value;
    this.item.update(updates);
  }
}
