/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */

const allowedItemTypes = ["weapon-ability"];
export class BreakWeaponSheet extends ItemSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["break", "sheet", "item", "weapon"],
      template: "systems/break/templates/items/weapon-sheet.hbs",
      width: 520,
      height: 480,
      dragDrop: [{dragSelector: null, dropSelector: null}]

    });
  }

  /** @inheritdoc */
  activateListeners(html) {
    super.activateListeners(html);

    if ( !this.isEditable ) return;
  }

  /** @inheritdoc */
  async getData(options) {
    const context = await super.getData(options);
    console.log(context)
    context.isWeapon = true;
    //context.abilities = context.item.items.filter(i => i.type === "weapon-ability");
    return context;
  }

  /** @override */
  async _onDrop(event) {
    console.log(event)
    /*if ( !this.actor.isOwner ) return false;
    const item = await Item.implementation.fromDropData(data);
    if(!allowedItemTypes.includes(item.type)) {return false;}
    if(this.actor.items.some(i => i._id === item._id)) {return false;}

    return BreakItem.createDocuments([item], {pack: this.actor.pack, parent: this.actor, keepId: true});*/
  }
  
}
  