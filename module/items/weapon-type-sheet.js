
/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class BreakWeaponTypeSheet extends ItemSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["break", "sheet", "weapon-type"],
      template: "systems/break/templates/items/weapon-type-sheet.hbs",
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
    context.isRanged = this.item.system.ranged;
    context.abilities = this.item.system.abilities;
    return context;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  activateListeners(html) {
    super.activateListeners(html);
    html.find(".delete-ability").on("click", this._onDeleteItem.bind(this));
    if ( !this.isEditable ) return;
  }

  async _onDeleteItem(event) {
    event.preventDefault();
    const button = event.currentTarget;
    const id = button.dataset.id;
    const itemIndex = this.item.system.abilities?.findIndex(i => i._id == id);
    if(itemIndex >= 0) {
      this.item.system.abilities.splice(itemIndex, 1);
      this.item.update({"system.abilities": this.item.system.abilities});
    }
  }


  /* -------------------------------------------- */

  /** @override */
  _getSubmitData(updateData) {
    let formData = super._getSubmitData(updateData);
    return formData;
  }

  /** @inheritdoc */
  async _onDrop(event) {
    const data = TextEditor.getDragEventData(event);
    if(data.type !== "Item") return;
    const draggedItem = await fromUuid(data.uuid)
    if(draggedItem.type === "ability" && draggedItem.system.subtype === "weapon") {
      const abilityArray = this.item.system.abilities ?? [];
      abilityArray.push(draggedItem.toObject());
      this.item.update({"system.abilities": abilityArray});
    }
  }
  
}
