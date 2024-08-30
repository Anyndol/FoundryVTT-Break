import { BreakItem } from "../items/item.js";

const allowedItemTypes = ["ability","accessory", "armor", "weapon"]

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class BreakAdversarySheet extends ActorSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["break", "sheet", "actor", "adversary"],
      template: "systems/break/templates/actors/adversary/adversary-sheet.html",
      width: 750,
      height: 850,
      tabs: [{navSelector: ".tabs", contentSelector: ".sheet-body", initial: "identity"}],
      scrollY: [".content"],
      dragDrop: [{dragSelector: null, dropSelector: null, permissions: {drop: () => false}}]
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  async _onDrop(event) {
    const t = event.target.closest(".equipment-drag-slot")
    if (!event.target.closest(".equipment-drag-slot")) return super._onDrop(event);
    const dragData = event.dataTransfer.getData("application/json");
    if (!dragData) return super._onDrop(event);
    const id = JSON.parse(dragData).id;
    const item = this.actor.items.find(i => i._id == id);
    this._onEquipItem(item);

    return true;
  }

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
    const source = this.actor.toObject();
    const actorData = this.actor.toObject(false);
    const context = await super.getData(options);
    context.shorthand = !!game.settings.get("break", "macroShorthand");
    context.notesHTML = await TextEditor.enrichHTML(context.actor.system.notes, {
      secrets: this.document.isOwner,
      async: true
    });

    context.actor.system.hearts.value = context.actor.system.hearts.value ?? context.actor.system.hearts.max;
    context.abilities = context.actor.items.filter(i => i.type === "ability");
    context.weapons = context.actor.items.filter(i => i.type === "weapon");
    context.weapons = context.weapons.map(w => {
      return {
        id: w._id,
        name: w.name,
        type: (w.system.weaponType1?.name ?? "") + " " + (w.system.weaponType2?.name ?? ""),
        isRanged: w.system.weaponType1?.system.ranged || w.system.weaponType2?.system.ranged,
        isMelee: (w.system.weaponType1 && !w.system.weaponType1.system.ranged) || (w.system.weaponType2 && !w.system.weaponType2.system.ranged),
        rangedExtraDamage: w.system.rangedExtraDamage,
        extraDamage: w.system.extraDamage,
        rangedAttackBonus: w.system.rangedAttackBonus,
        attackBonus: w.system.attackBonus
      }
    });
    if (context.actor.system.equipment.armor && context.actor.system.equipment.armor.system.speedLimit != null && context.actor.system.equipment.armor.system.speedLimit != "") {
      context.speedRating = +context.actor.system.equipment.armor.system.speedLimit < context.speedRating ? +context.actor.system.equipment.armor.system.speedLimit : context.speedRating;
    }
    context.defenseRating = +context.actor.system.defense.value + +context.actor.system.defense.bon + (context.actor.system.equipment.armor ? +context.actor.system.equipment.armor.system.defenseBonus : 0) + (context.speedRating == 2 ? 2 : +context.speedRating >= 3 ? 4 : 0);
    const equipment = context.actor.system.equipment;

    context.attackBonus = context.actor.system.attack.value + context.actor.system.attack.bon;
    context.speedRating = context.actor.system.speed.value + context.actor.system.speed.bon;

    console.log(context);

    return context;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  activateListeners(html) {
    super.activateListeners(html);

    html.find(".aptitude-value-circle.clickable").on("click", this._onRollAptitude.bind(this));
    html.find(".combat-value-circle.clickable").on("click", this._onRollAttack.bind(this));

    html.find("i.attack-ranged").on("click", this._onRollAttack.bind(this));
    html.find("i.attack-melee").on("click", this._onRollAttack.bind(this));

    // Everything below here is only needed if the sheet is editable
    if ( !this.isEditable ) return;

    html.find("button.hearts.clickable").on("click", this._onModifyHearts.bind(this));
    html.find("i.delete-weapon").on("click", this._onDeleteItem.bind(this));

    // Add draggable for Macro creation
    html.find(".aptitudes a.aptitude-roll").each((i, a) => {
      a.setAttribute("draggable", true);
      a.addEventListener("dragstart", ev => {
        let dragData = ev.currentTarget.dataset;
        ev.dataTransfer.setData('text/plain', JSON.stringify(dragData));
      }, false);
    });

    html.find("[data-context-menu]").each((i, a) => {
      a.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        const { clientX, clientY } = event;
        event.currentTarget.closest("[data-id]").dispatchEvent(new PointerEvent("contextmenu", {
          view: window, bubbles: true, cancelable: true, clientX, clientY
        }));
      });
    })

    new ContextMenu(html, "[data-id]", [], { onOpen: this._onOpenContextMenu.bind(this) });
  }

  async _onRollAptitude(event) {
    event.preventDefault();
    const button = event.currentTarget;
    const aptitudeId = button.dataset.id;
    this.actor.rollAptitude(aptitudeId)

  }

  async _onDeleteItem(element) {
    const id = element.dataset?.id ?? element.currentTarget?.attributes?.getNamedItem("data-id")?.value;
    this.actor.deleteItem(id);
  }

  async _onRollAttack(event) {
    event.preventDefault();
    const button = event.currentTarget;
    const bonus = button.dataset.bonus ?? 0;
    const extraDamage = button.dataset.extradamage ?? 0;
    this.actor.rollAttack(bonus, extraDamage)
  }

  async _onModifyHearts(event) {
    event.preventDefault();
    const amount = event.currentTarget.dataset.amount;
    this.actor.modifyHp(+amount);
  }

  _onOpenContextMenu(element) {
    const item = this.document.items.get(element.dataset.id);
    if (!item || (item instanceof Promise)) return;
    ui.context.menuItems = this._getContextOptions(item);
  }

  _getContextOptions(item) {
    const options = [
      {
        name: "BREAK.ContextMenuEdit",
        icon: "<i class='fas fa-edit fa-fw'></i>",
        condition: () => item.isOwner,
        callback: li => this._onDisplayItem(li[0])
      },
      {
        name: "BREAK.ContextMenuDelete",
        icon: "<i class='fas fa-trash fa-fw'></i>",
        condition: () => item.isOwner,
        callback: li => this._onDeleteItem(li[0])
      }
    ];

    return options;
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
