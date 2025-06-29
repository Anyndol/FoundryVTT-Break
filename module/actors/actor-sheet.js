import { parseInputDelta } from "../../utils/utils.mjs";
import { RANK_XP} from "../constants.js";
import BREAK from "../constants.js";
import { BreakItem } from "../items/item.js";

const allowedItemTypes = [
// Equipment
  "weapon",
  "armor",
  "shield",
// Inventory
  "gift",
  "accessory",
  "book",
  "combustible",
  "consumable",
  "curiosity",
  "illumination",
  "kit",
  "miscellaneous",
  "otherworld",
  "outfit",
  "wayfinding",
// Status
  "calling",
  "species",
  "size",
  "homeland",
  "history",
  "quirk",
  "ability",
  "advancement"
]

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class BreakActorSheet extends ActorSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    this.selectedBag = null;

    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["break", "sheet", "actor"],
      template: "systems/break/templates/actors/actor-sheet.html",
      width: 750,
      height: 870,
      tabs: [{navSelector: ".tabs", contentSelector: ".sheet-body", initial: "identity"}],
      scrollY: [".content"],
      dragDrop: [{dragSelector: ".directory-item.document", dropSelector: null, permissions: {drop: () => false}},
        {dragSelector: ".bag-item", dropSelector: ".equipment-drag-slot"}]
    });
  }

  _onOpenContextMenu(element) {
    const item = this.document.items.get(element.dataset.id);
    if (!item || (item instanceof Promise)) return;

    item.equippable = element.dataset.equippable;
    ui.context.menuItems = this._getContextOptions(item);
  }

  _getContextOptions(item) {
    const options = [
      {
        name: "BREAK.Equip",
        icon: "<i class='fa-solid fa-shield'></i>",
        condition: () => item.equippable === 'true',
        callback: li => {
          const id = li[0].dataset?.id ?? li[0].currentTarget?.attributes?.getNamedItem("data-id")?.value;
          const item = this.document.items.get(id);
          this._onEquipItem(item);
        }
      },
      {
        name: "BREAK.SendToChat",
        icon: "<i class='fa-solid fa-fw fa-comment-alt'></i>",
        condition: () => item.isOwner,
        callback: li => this._onSendToChat(li[0])
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

  /** @inheritDoc */
  _onDragStart(event) {
    // Add another deferred deactivation to catch the second pointerenter event that seems to be fired on Firefox.
    const data = event.target.closest(".bag-item")?.dataset ?? {};
    if ( !data.type ) return super._onDragStart(event);
    event.dataTransfer.setData("application/json", JSON.stringify(data));
  }


  /** @inheritDoc */
  _canDragDrop(selector) {
    return this.isEditable;
  }

  /** @inheritdoc */
  async _onDrop(event) {
    const data = TextEditor.getDragEventData(event);
    if(data.type !== "Item") return;
    const draggedItem = await fromUuid(data.uuid);

    if (draggedItem.type === "calling") {
      this.actor.update({"system.calling": draggedItem.toObject()});
    } else if(draggedItem.type === "species") {
      this.actor.update({"system.species": draggedItem.toObject()});
    } else if(draggedItem.type === "homeland") {
      this.actor.update({"system.homeland": draggedItem.toObject()});
    } else if(draggedItem.type === "history") {
      this.actor.update({"system.history": draggedItem.toObject()});
    } else {
      const t = event.target.closest(".equipment-drag-slot")
      if(!event.target.closest(".equipment-drag-slot")) return super._onDrop(event);
      const dragData = event.dataTransfer.getData("application/json");
      if ( !dragData ) return super._onDrop(event);
      const id = JSON.parse(dragData).id;
      const item = this.actor.items.find(i => i._id == id);
      this._onEquipItem(item);
    }

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
    const context = await super.getData(options);
    context.shorthand = !!game.settings.get("break", "macroShorthand");
    context.biographyHTML = await TextEditor.enrichHTML(context.actor.system.biography, {
      secrets: this.document.isOwner,
      async: true
    });
    context.notesHTML = await TextEditor.enrichHTML(context.data.system.notes, {
      secrets: this.document.isOwner,
      async: true
    });

    for(let i = 0; i < RANK_XP.length; i++){
      if(RANK_XP[i] <= context.actor.system.xp.current) {
        context.rank = i + 1;
      } else {
        context.xpNextRank = RANK_XP[i] - context.actor.system.xp.current;
        break;
      }
    }

    //////////////////////////////
    ////  CONFIGURE SPECIES & SIZE
    context.species = typeof context.actor.system.species !== "string" ? context.actor.system.species : null;
    context.hasSpecies = context.species != null;

    const size = context.hasSpecies ? context.species.system.size : null;
    context.size = size;

    ///////////////////////
    ////  CONFIGURE CALLING

    context.calling = typeof context.actor.system.calling !== "string" ?  context.actor.system.calling : null;
    context.hasCalling = context.calling != null;
    
    ////TEMPORAL DATA MIGRATION HACK
      if(context.actor.system.aptitudes.Might != null) {
        context.actor.system.aptitudes.might.value = context.actor.system.aptitudes.Might.value;
        context.actor.system.aptitudes.might.bon = context.actor.system.aptitudes.Might.bon;
        context.actor.system.aptitudes.might.trait = context.actor.system.aptitudes.Might.trait;
        delete context.actor.system.aptitudes.Might;
      }
      if(context.actor.system.aptitudes.Deftness != null) {
        context.actor.system.aptitudes.deftness.value = context.actor.system.aptitudes.Deftness.value;
        context.actor.system.aptitudes.deftness.bon = context.actor.system.aptitudes.Deftness.bon;
        context.actor.system.aptitudes.deftness.trait = context.actor.system.aptitudes.Deftness.trait;
        delete context.actor.system.aptitudes.Deftness;
      }
      if(context.actor.system.aptitudes.Grit != null) {
        context.actor.system.aptitudes.grit.value = context.actor.system.aptitudes.Grit.value;
        context.actor.system.aptitudes.grit.bon = context.actor.system.aptitudes.Grit.bon;
        context.actor.system.aptitudes.grit.trait = context.actor.system.aptitudes.Grit.trait;
        delete context.actor.system.aptitudes.Grit;
      }
      if(context.actor.system.aptitudes.Insight != null) {
        context.actor.system.aptitudes.insight.value = context.actor.system.aptitudes.Insight.value;
        context.actor.system.aptitudes.insight.bon = context.actor.system.aptitudes.Insight.bon;
        context.actor.system.aptitudes.insight.trait = context.actor.system.aptitudes.Insight.trait;
        delete context.actor.system.aptitudes.Insight;
      }
      if(context.actor.system.aptitudes.Aura != null) {
        context.actor.system.aptitudes.aura.value = context.actor.system.aptitudes.Aura.value;
        context.actor.system.aptitudes.aura.bon = context.actor.system.aptitudes.Aura.bon;
        context.actor.system.aptitudes.aura.trait = context.actor.system.aptitudes.Aura.trait;
        delete context.actor.system.aptitudes.Aura;
      }
      if(context.actor.system.aptitudes.might.base != null) {
        context.actor.system.aptitudes.might.value = context.actor.system.aptitudes.might.base;
        delete context.actor.system.aptitudes.might.base;
      }
      if(context.actor.system.aptitudes.deftness.base != null) {
        context.actor.system.aptitudes.deftness.value = context.actor.system.aptitudes.deftness.base;
        delete context.actor.system.aptitudes.deftness.base;
      }
      if(context.actor.system.aptitudes.grit.base != null) {
        context.actor.system.aptitudes.grit.value = context.actor.system.aptitudes.grit.base;
        delete context.actor.system.aptitudes.grit.base;
      }
      if(context.actor.system.aptitudes.insight.base != null) {
        context.actor.system.aptitudes.insight.value = context.actor.system.aptitudes.insight.base;
        delete context.actor.system.aptitudes.insight.base;
      }
      if(context.actor.system.aptitudes.aura.base != null) {
        context.actor.system.aptitudes.aura.value = context.actor.system.aptitudes.aura.base;
        delete context.actor.system.aptitudes.aura.base;
      }
    ////
    if (context.hasCalling && context.calling.system.advancementTable != null) {
      const stats = context.calling.system.advancementTable[context.rank - 1];

      context.actor.system.aptitudes.might.value = stats.might + (size ? size.system.mightModifier : 0);
      context.actor.system.aptitudes.deftness.value = stats.deftness + (size ? size.system.deftnessModifier : 0);
      context.actor.system.aptitudes.grit.value = stats.grit;
      context.actor.system.aptitudes.insight.value = stats.insight;
      context.actor.system.aptitudes.aura.value = stats.aura;

      context.actor.system.attack.value = stats.attack;
      context.actor.system.hearts.max = stats.hearts;

      context.actor.system.defense.value = context.calling.system.baseDefense + (size ? +size.system.defenseModifier : 0);
      context.actor.system.speed.value = context.calling.system.baseSpeed;
    } /*else {
      context.actor.system.aptitudes.might.base = 0;
      context.actor.system.aptitudes.deftness.base = 0;
      context.actor.system.aptitudes.grit.base = 0;
      context.actor.system.aptitudes.insight.base = 0;
      context.actor.system.aptitudes.aura.base = 0;

      context.actor.system.attack.value = 0;
      context.actor.system.hearts.max = 1;

      context.actor.system.defense.value = 0;
      context.actor.system.speed.value = 1;
    }*/
    console.log(context.actor.system.aptitudes)

    //////////////////////////////////
    ////  CONFIGURE HOMELAND & HISTORY
    context.homeland = typeof context.actor.system.homeland !== "string" ?  context.actor.system.homeland : null;
    context.hasHomeland = context.homeland != null;

    context.history = typeof context.actor.system.history !== "string" ?  context.actor.system.history : null;
    context.hasHistory = context.history != null;

    ///////////////////////////
    ////  CONFIGURE HEARTS & XP
    // Reset player hearts so they don't exceed maximum, in case that changed
    let maxHearts = context.actor.system.hearts.max + context.actor.system.hearts.bon;
    context.actor.system.hearts.value = Math.min(context.actor.system.hearts.value, maxHearts);

    context.abilities = context.actor.items.filter(i => i.type === "ability");
    context.gifts = context.actor.items.filter(i => i.type === "gift");
    context.quirks = context.actor.items.filter(i => i.type === "quirk");
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

    const attack = context.actor.system.attack;
    const defense = context.actor.system.defense;
    const speed = context.actor.system.speed;

    const armor = context.actor.system.equipment.armor;
    const shield = context.actor.system.equipment.shield;

    context.attackBonus = attack.value + attack.bon;
    const rawSpeed = speed.value + speed.bon - (shield ? shield.speedPenalty : 0);
    // Max speed is 3 (Very Fast), or if armor is worn then the armor's speed limit if it's less
    const maxSpeed = Math.min(((armor && armor.system.speedLimit) ? +armor.system.speedLimit : 3), 3);
    context.speedRating = Math.min(rawSpeed, maxSpeed);
    context.defenseRating = defense.value + defense.bon + (armor ? +armor.system.defenseBonus : 0) + (context.speedRating == 2 ? 2 : +context.speedRating >= 3 ? 4 : 0);

    let allegiancePoints = +context.actor.system.allegiance.dark + +context.actor.system.allegiance.bright;
    // 0 = None, 1 = Bright, 2 = Twilight, 3 = Bright
    if(+allegiancePoints <= 1){
      context.allegiance = 0;
    } else if(+context.actor.system.allegiance.dark > +context.actor.system.allegiance.bright+1){
      context.allegiance = 1;
    } else if(+context.actor.system.allegiance.bright > +context.actor.system.allegiance.dark+1) {
      context.allegiance = 3;
    } else {
      context.allegiance = 2;
    }

    const equipment = context.actor.system.equipment;
    const equippedItemIds = [equipment.armor?._id, equipment.outfit?._id, ...equipment.weapon.map(i => i._id), ...equipment.accessory.map(i => i._id)];
    context.bagContent = context.actor.items.filter(i => !["ability", "quirk", "gift"].includes(i.type)
      && !equippedItemIds.includes(i._id) && i.bag == this.selectedBag).map(i => ({ ...i, _id: i._id, equippable: ["armor", "weapon", "outfit", "accessory", "shield"].includes(i.type) }));
    const precision = 2;
    const factor = Math.pow(10, precision);
    context.usedInventorySlots = Math.round(context.bagContent.reduce((ac, cv) => ac + cv.system.slots * cv.system.quantity, 0) * factor) / factor;
    context.actor.system.purviews = context.actor.system.purviews.replaceAll("\n", "&#10;")

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

    html.find(".select-feature").on("click", this._onSelectFeature.bind(this));
    html.find(".delete-feature").on("click", this._onDeleteFeature.bind(this));

    html.find(".aptitude-container").on("click", ".aptitude-trait", this._onSetTrait.bind(this));

    html.find(".delete-gift").on("click", this._onDeleteItem.bind(this));
    html.find(".delete-quirk").on("click", this._onDeleteItem.bind(this));

    html.find("button.hearts.clickable").on("click", this._onModifyHearts.bind(this));

    html.find("i.delete-weapon").on("click", this._onDeleteItem.bind(this));
    html.find("i.unequip-item").on("click", this._onUnequipItem.bind(this));
    html.find("a.item-link").on("click", this._onLinkItem.bind(this));

    html.find("a.add-item-custom").on("click", this._onAddItemCustom.bind(this));
    html.find("a.adjustment-button").on("click", this._onAdjustItemQuantity.bind(this));
    html.find("input.item-quantity").on("change", this._onChangeItemInput.bind(this));

    // Add draggable for Macro creation
    html.find(".aptitudes a.aptitude-roll").each((i, a) => {
      a.setAttribute("draggable", true);
      a.addEventListener("dragstart", ev => {
        let dragData = ev.currentTarget.dataset;
        ev.dataTransfer.setData('text/plain', JSON.stringify(dragData));
      }, false);
    });

    html.find("[data-context-menu]").each((i, a) =>{
      a.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        const { clientX, clientY } = event;
        event.currentTarget.closest("[data-id]").dispatchEvent(new PointerEvent("contextmenu", {
          view: window, bubbles: true, cancelable: true, clientX, clientY
        }));
      });
    })

    new ContextMenu(html, "[data-id]", [], {onOpen: this._onOpenContextMenu.bind(this)});
  }

  /* -------------------------------------------- */

  async _onSelectFeature(event) {
    event.preventDefault();
    const featureType = event.currentTarget.id;

    function selectFeature(actor, item) {
      const update = {};
      update["system." + item.type] = item;
      actor.update(update);
    }

    function getItemsList(featureType, actor) {
      switch (featureType) {
        case "history":
          return actor.system.homeland?.system?.histories && actor.system.homeland.system.histories.length > 0 ? actor.system.homeland.system.histories : game.items;
        default:
          return game.items;
      }
    }

    const buttons = {}
    const items = getItemsList(featureType, this.actor);

    for (const item of items) {
      if (item.type === featureType) {
        buttons[item._id] = {
          label: item.name,
          callback: (_) => selectFeature(this.actor, item)
        }
      }
    }

    const content = `
      <style>
      #featureSelector .dialog-buttons {
        flex-direction: column
      }
      </style>
    `

    const options = {
      id: "featureSelector",
      resizable: true
    }

    new Dialog({
      title: "Feature Selector",
      content: content,
      buttons: buttons
    }, options).render(true);
  }

  async _onDeleteFeature(event) {
    event.preventDefault();
    const featureType = event.currentTarget.id;
    const deleteableFeatures = [
      "calling",
      "species",
      "homeland",
      "history"
    ]

    if (deleteableFeatures.includes(featureType)) {
      const upd = {};
      upd["system." + featureType] = null;
      this.actor.update(upd);
    }
  }

  async _onSetTrait(event) {
    event.preventDefault();
    const button = event.currentTarget;
    const aptitude = button.parentElement.children[1].dataset.aptitude;
    const value = button.dataset.option;
    if(aptitude == undefined || value == undefined) {
      return;
    }
    this.actor.setAptitudeTrait(aptitude, +value)
  }

  async _onEquipItem(item) {
    switch(item.type){
      case "armor":
        this.actor.update({"system.equipment.armor": {...item, _id: item._id}});
        return;
      case "outfit":
        this.actor.update({ "system.equipment.outfit": { ...item, _id: item._id } });
        return;
      case "weapon":
        this.actor.system.equipment.weapon.push({ ...item, _id: item._id }) 
        this.actor.update({ "system.equipment.weapon": this.actor.system.equipment.weapon });
        return;
      case "accessory":
        this.actor.system.equipment.accessory.push({ ...item, _id: item._id })
        this.actor.update({ "system.equipment.accessory": this.actor.system.equipment.accessory });
        return;
    }
  }

  async _onUnequipItem(event) {
    event.preventDefault();
    const button = event.currentTarget;
    const id = button.dataset.itemId;
    const type = button.dataset.type;

    this.actor.unequipItem(id, type);
  }

  async _onDeleteItem(element) {
    const id = element.dataset?.id ?? element.currentTarget?.attributes?.getNamedItem("data-id")?.value;
    this.actor.deleteItem(id);
  }

  async _onSendToChat(element) {
    const id = element.dataset.id;
    const item = this.document.items.get(id);
    await item.sendToChat();
  }

  async _onLinkItem(event) {
    event.preventDefault();
    const button = event.currentTarget.closest("[data-id]");
    const id = button.dataset.id;
    const item = this.document.items.get(id);
    item.sheet.render(true);
  }

  async _onAddItemCustom(event) {
    event.preventDefault();
    return Item.implementation.createDialog({}, {
      parent: this.actor, pack: this.actor.pack, types: [
        "weapon",
        "armor",
        "shield",
        "outfit",
        "accessory",
        "wayfinding",
        "illumination",
        "kit",
        "book",
        "consumable",
        "combustible",
        "miscellaneous",
        "curiosity",
        "otherworld",
        "calling",
        "species",
        "size",
        "homeland",
        "history",
        "quirk",
        "ability",
        "advancement"
      ]
    });
  }

  async _onAdjustItemQuantity(event) {
    event.preventDefault();
    const button = event.currentTarget;
    const { action } = button.dataset;
    const input = button.parentElement.querySelector("input");
    const min = input.min ? Number(input.min) : -Infinity;
    const max = input.max ? Number(input.max) : Infinity;
    let value = Number(input.value);
    if ( isNaN(value) ) return;
    value += action === "increase" ? 1 : -1;
    input.value = Math.min(Math.max(value, min), max);
    input.dispatchEvent(new Event("change"));
  }

  async _onChangeItemInput(event) {
    event.preventDefault();
    const input = event.target;
    const itemId = input.closest("[data-id]")?.dataset.id;
    const item = this.document.items.get(itemId);
    if ( !item ) return;
    const result = parseInputDelta(input, item);
    if ( result !== undefined ) item.update({ [input.dataset.name]: result });
  }

  async _onRollAptitude(event) {
    event.preventDefault();
    const button = event.currentTarget;
    const aptitudeId = button.dataset.id;
    this.actor.rollAptitude(aptitudeId)
    
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

  /* -------------------------------------------- */

  /**
   * Listen for roll buttons on items.
   * @param {MouseEvent} event    The originating left click event
   */
  _onItemRoll(event) {
    let button = $(event.currentTarget);
    const li = button.parents(".item");
    const item = this.actor.items.get(li.data("itemId"));
    let r = new Roll(button.data('roll'), this.actor.getRollData());
    return r.toMessage({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: `<h2>${item.name}</h2><h3>${button.text()}</h3>`
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  _getSubmitData(updateData) {
    let formData = super._getSubmitData(updateData);
    return formData;
  }
}
