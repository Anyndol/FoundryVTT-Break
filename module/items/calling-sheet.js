import { BreakItemSheet } from "./item-sheet.js";

export class BreakCallingSheet extends BreakItemSheet {

    /** @inheritdoc */
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        classes: ["break", "sheet", "calling"],
        template: "systems/break/templates/items/calling-sheet.hbs",
        width: 650,
        height: 520,
        dragDrop: [{dragSelector: null, dropSelector: null}]
      });
    }
  
    /** @inheritdoc */
    activateListeners(html) {
      super.activateListeners(html);
      if ( !this.isEditable ) return;
      html.find(".delete-starting-ability").on("click", this.onDeleteStartingAbility.bind(this));
      html.find(".delete-elective-ability").on("click", this.onDeleteElectiveAbility.bind(this));
      html.find(".delete-allowance").on("click", this.onDeleteAllowance.bind(this));
    }

    async onDeleteStartingAbility(event) {
      event.preventDefault();
      const index = parseInt(event.currentTarget.id.split('-')[1], 10);
      this.item.system.startingAbilities.splice(index, 1);
      this.item.update({"system.startingAbilities": this.item.system.startingAbilities});
    }

    async onDeleteElectiveAbility(event) {
      event.preventDefault();
      const index = parseInt(event.currentTarget.id.split('-')[1], 10);
      this.item.system.abilities.splice(index, 1);
      this.item.update({"system.abilities": this.item.system.abilities});
    }

    async onDeleteAllowance(event) {
      event.preventDefault();
      const ids = event.currentTarget.id.split('-');

      if (ids[0] === "armor") {
        let index = this.item.system.armorAllowances?.findIndex(i => i._id === ids[1]);
        if (index >= 0) {
          this.item.system.armorAllowances.splice(index, 1);
          this.item.update({"system.armorAllowances": this.item.system.armorAllowances});
        } else {
          index = this.item.system.shieldAllowances?.findIndex(i => i._id === ids[1]);
          this.item.system.shieldAllowances.splice(index, 1);
          this.item.update({"system.shieldAllowances": this.item.system.shieldAllowances});
        }
      } else {
        const index = this.item.system.weaponAllowances?.findIndex(i => i._id === ids[1]);
        this.item.system.weaponAllowances.splice(index, 1);
        this.item.update({"system.weaponAllowances": this.item.system.weaponAllowances});
      }
    }

    /** @inheritdoc */
    async getData(options) {
        const context = await super.getData(options);
        context.descriptionHTML = await TextEditor.enrichHTML(context.item.system.description, {
            secrets: this.document.isOwner,
            async: true
        });

        context.advancementTable = context.item.system.advancementTable;
        context.advancementTableEditable = false;

        context.startingAbilities = context.item.system.startingAbilities ?? [];
        context.hasStartingAbilities = context.startingAbilities.length > 0;
        context.electiveAbilities = context.item.system.abilities ?? [];
        context.hasElectiveAbilities = context.electiveAbilities.length > 0;

        context.armorAllowances = (context.item.system.armorAllowances ?? []).concat(context.item.system.shieldAllowances);
        context.hasArmorAllowances = context.armorAllowances.length > 0;
        
        context.meleeAllowances = [];
        context.missileAllowances = [];
        const weaponAllowances = context.item.system.weaponAllowances ?? [];
        for (let a of weaponAllowances) {
          
          if (a.system.ranged) {
            context.missileAllowances.push(a);
          } else {
            context.meleeAllowances.push(a);
          }
        }
        context.hasMeleeAllowances = context.meleeAllowances.length > 0;
        context.hasMissileAllowances = context.missileAllowances.length > 0;

        console.log("DEBUG CONTEXT:" + JSON.stringify(context, null, 2));
        return context;
    }

    /** @inheritdoc */
    async _onDrop(event) {
        const data = TextEditor.getDragEventData(event);
        if(data.type !== "Item") return;
        const draggedItem = await fromUuid(data.uuid);

        if (draggedItem.type === "advancement") {
          this.item.update({"system.advancementTable": draggedItem.system.table});
        } else if(draggedItem.type === "ability") {
          if(event.target.id === "startingAbilities") {
            const sa = this.item.system.startingAbilities ?? [];
            sa.push(draggedItem.toObject());
            this.item.update({"system.startingAbilities": sa});
          } else if (event.target.id === "electiveAbilities") {
            const sa = this.item.system.abilities ?? [];
            sa.push(draggedItem.toObject());
            this.item.update({"system.abilities": sa});
          }
        } else if(draggedItem.type === "weapon-type") {
          const wpns = this.item.system.weaponAllowances ?? [];
          if (!wpns.some(w => w._id === draggedItem._id)) {
            wpns.push(draggedItem.toObject());
            this.item.update({"system.weaponAllowances": wpns});
          }
        } else if(draggedItem.type === "armor-type") {
          const armr = this.item.system.armorAllowances ?? [];
          if (!armr.some(w => w._id === draggedItem._id)) {
            armr.push(draggedItem.toObject());
            this.item.update({"system.armorAllowances": armr});
          }
        } else if(draggedItem.type === "shield-type") {
          const shld = this.item.system.shieldAllowances ?? [];
          if (!shld.some(w => w._id === draggedItem._id)) {
            shld.push(draggedItem.toObject());
            this.item.update({"system.shieldAllowances": shld});
          }
        }
    }

    /** @override */
    _getSubmitData(updateData) {
        let formData = super._getSubmitData(updateData);
        return formData;
    }
}
