import { BreakItemSheet } from "./item-sheet.js";

export class BreakSizeSheet extends BreakItemSheet {

    /** @inheritdoc */
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        classes: ["break", "sheet", "size"],
        template: "systems/break/templates/items/size-sheet.hbs",
        width: 600,
        height: 480,
        dragDrop: [{dragSelector: null, dropSelector: null}]
      });
    }
  
    /** @inheritdoc */
    activateListeners(html) {
      super.activateListeners(html);
      if ( !this.isEditable ) return;
      html.find(".delete-restriction").on("click", this.deleteRestriction.bind(this));
    }

    async deleteRestriction(event) {
        const element = event.currentTarget;
        let idParts = element.id.split('-');
        let kind = idParts[0];
        let itemIndex = parseInt(idParts[1], 10);

        console.log("DEBUG: deleteRestriction (" + kind + "), (" + itemIndex + ")");

        switch(kind) {
            case "melee":
                this.item.system.meleeRestrictions.splice(itemIndex, 1);
                this.item.update({"system.meleeRestrictions": this.item.system.meleeRestrictions});
                break;
            case "armor":
                this.item.system.armorRestrictions.splice(itemIndex, 1);
                this.item.update({"system.armorRestrictions": this.item.system.armorRestrictions});
                break;
            case "shield":
                this.item.system.shieldRestrictions.splice(itemIndex, 1);
                this.item.update({"system.shieldRestrictions": this.item.system.shieldRestrictions});
                break;
            case "missile":
                this.item.system.missileRestrictions.splice(itemIndex, 1);
                this.item.update({"system.missileRestrictions": this.item.system.missileRestrictions});
                break;
        }
    }

    /** @inheritdoc */
    async getData(options) {
        const context = await super.getData(options);
        context.descriptionHTML = await TextEditor.enrichHTML(context.item.system.description, {
            secrets: this.document.isOwner,
            async: true
        });

        context.meleeRestrictions = this.item.system.meleeRestrictions;
        context.hasMeleeRestrictions = context.meleeRestrictions.length > 0;
        context.missileRestrictions = this.item.system.missileRestrictions;
        context.hasMissileRestrictions = context.missileRestrictions.length > 0;
        context.armorRestrictions = this.item.system.armorRestrictions;
        context.hasArmorRestrictions = context.armorRestrictions.length > 0;
        context.shieldRestrictions = this.item.system.shieldRestrictions;
        context.hasShieldRestrictions = context.shieldRestrictions.length > 0;

        return context;
    }

    /** @inheritdoc */
    async _onDrop(event) {
        const data = TextEditor.getDragEventData(event);
        if(data.type !== "Item") return;
        const draggedItem = await fromUuid(data.uuid);
        switch(draggedItem.type) {
            case "weapon-type":
                if (draggedItem.system.ranged) {
                    const missileRs = this.item.system.missileRestrictions ?? [];
                    missileRs.push(draggedItem.toObject());
                    this.item.update({"system.missileRestrictions": missileRs});
                } else {
                    const meleeRs = this.item.system.meleeRestrictions ?? [];
                    meleeRs.push(draggedItem.toObject());
                    this.item.update({"system.meleeRestrictions": meleeRs});
                }
                break;
            case "armor-type":
                {
                    const armorRs = this.item.system.armorRestrictions ?? [];
                    armorRs.push(draggedItem.toObject());
                    this.item.update({"system.armorRestrictions": armorRs});
                }
                break;
            case "shield-type":
                {
                    const shieldRs = this.item.system.shieldRestrictions ?? [];
                    shieldRs.push(draggedItem.toObject());
                    this.item.update({"system.shieldRestrictions": shieldRs});
                }
                break;
        }
        // if(draggedItem.type === "history") {
        //     const historyArray = this.item.system.histories ?? [];
        //     historyArray.push(draggedItem.toObject());
        //     this.item.update({"system.histories": historyArray});
        // }
    }

    /** @override */
    _getSubmitData(updateData) {
        let formData = super._getSubmitData(updateData);
        return formData;
    }
}
