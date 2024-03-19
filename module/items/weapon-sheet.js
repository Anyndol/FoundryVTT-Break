/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */

export class BreakWeaponSheet extends ItemSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["break", "sheet", "item", "weapon"],
      template: "systems/break/templates/items/weapon-sheet.hbs",
      width: 600,
      height: 480,
      dragDrop: [{dragSelector: null, dropSelector: null}]
    });
  }

  /** @inheritdoc */
  activateListeners(html) {
    super.activateListeners(html);
    if ( !this.isEditable ) return;
    html.find(".delete-ability").on("click", this.item.onDeleteAbility.bind(this));
  }

  /** @inheritdoc */
  async getData(options) {
    const context = await super.getData(options);
    context.descriptionHTML = await TextEditor.enrichHTML(context.item.system.description, {
      secrets: this.document.isOwner,
      async: true
    });
    context.isWeapon = true;
    context.isRanged = context.item.system.weaponType1?.system.ranged || context.item.system.weaponType2?.system.ranged;
    context.isMelee = (context.item.system.weaponType1 && !context.item.system.weaponType1.system.ranged) || (context.item.system.weaponType2 && !context.item.system.weaponType2.system.ranged);
    context.abilities = context.item.system.abilities ?? [];
    return context;
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
    } else if(draggedItem.type === "weapon-type") {
      if(event.target.id === "weaponType1" ){
        const prunedAbilities = this.item.mergeAndPruneAbilities(draggedItem.system.abilities ?? []);
        await this.item.update({"system.weaponType1": draggedItem.toObject(), "system.abilities": prunedAbilities});
        this._onSetWeaponType();
      } else if(event.target.id === "weaponType2"){
        const prunedAbilities = this.item.mergeAndPruneAbilities(draggedItem.system.abilities ?? []);
        await this.item.update({"system.weaponType2": draggedItem.toObject(), "system.abilities": prunedAbilities});
        this._onSetWeaponType();
      }
    }
  }

  _onSetWeaponType() {
    const type1 = this.item.system.weaponType1;
    const type2 = this.item.system.weaponType2
    const updates = {};
    let lowerExtraDamage = 0;
    let lowerRangedExtraDamage = 0;
    let higherSlots = 0;
    let itemValue = 0;
    let higherRange = 0;
    let lowerLoadingTime = 0;

    const checkValues = (type) => {
      if(type) {
        if(type.system.ranged) {
          if(type.system.extraDamage < lowerRangedExtraDamage || lowerRangedExtraDamage == 0)
            lowerRangedExtraDamage = type.system.extraDamage
          if(type.system.range > higherRange)
            higherRange = type.system.range
          if(type.system.loadingTime < lowerLoadingTime || lowerLoadingTime == 0)
            lowerLoadingTime = type.system.loadingTime
        } else if(!type.system.ranged && (type.system.extraDamage < lowerExtraDamage || lowerExtraDamage == 0)) {
          lowerExtraDamage = type.system.extraDamage
        }
        if(type.system.slots > higherSlots) {
          higherSlots = type.system.slots;
        }
        if(type.system.value) {
          itemValue += type.system.value.stones;
          itemValue += type.system.value.coins*10;
          itemValue += type.system.value.gems*1000;  
        }
      }
    }

    checkValues(type1);
    checkValues(type2);    
    if(type1 && type2)
      itemValue *= 2;
    updates["system.extraDamage"] = lowerExtraDamage;
    updates["system.rangedExtraDamage"] = lowerRangedExtraDamage;
    updates["system.slots"] = higherSlots;
    updates["system.loadingTime"] = lowerLoadingTime;
    updates["system.range"] = higherRange;
    const gems = Math.floor(itemValue/1000);
    const coins = Math.floor((itemValue-gems*1000)/10);
    const stones = itemValue-(gems*1000)-(coins*10);
    updates["system.value"] = {
      gems,
      coins,
      stones
    }

    this.item.update(updates);
  }
}
  