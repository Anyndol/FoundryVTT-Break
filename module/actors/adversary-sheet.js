import { BreakItem } from "../items/item.js";

const allowedItemTypes = []

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class BreakAdversarySheet extends ActorSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["break", "sheet", "actor"],
      template: "systems/break/templates/actors/adversary-sheet.html",
      width: 750,
      height: 850,
      tabs: [{navSelector: ".tabs", contentSelector: ".sheet-body", initial: "identity"}],
      scrollY: [".content"],
      dragDrop: [{dragSelector: null, dropSelector: null, permissions: {drop: () => false}}]
    });
  }

  /* -------------------------------------------- */

  /** @override */
  async _onDropItem(event, data) {
    if ( !this.actor.isOwner ) return false;
    const item = await Item.implementation.fromDropData(data);
    if(!allowedItemTypes.includes(item.type)) {return false;}
    if(this.actor.items.some(i => i._id === item._id)) {return false;}

    return BreakItem.createDocuments([item], {pack: this.actor.pack, parent: this.actor, keepId: true});
  }

  /** @inheritdoc */
  async getData(options) {
    const context = await super.getData(options);
    context.shorthand = !!game.settings.get("break", "macroShorthand");
    context.biographyHTML = await TextEditor.enrichHTML(context.data.system.biography, {
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

  /** @inheritdoc */
  _getSubmitData(updateData) {
    let formData = super._getSubmitData(updateData);
    //formData = EntitySheetHelper.updateAptitudes(formData, this.object);
    //formData = EntitySheetHelper.updateGroups(formData, this.object);
    return formData;
  }
}
