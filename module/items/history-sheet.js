import { BreakItemSheet } from "./item-sheet.js";

export class BreakHistorySheet extends BreakItemSheet {

    /** @inheritdoc */
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        classes: ["break", "sheet", "history"],
        template: "systems/break/templates/items/history-sheet.hbs",
        width: 600,
        height: 480,
        dragDrop: [{dragSelector: null, dropSelector: null}]
      });
    }
  
    /** @inheritdoc */
    activateListeners(html) {
        super.activateListeners(html);
        if ( !this.isEditable ) return;
        html.find(".delete-gear").on("click", this.item.onDeleteStartingGear.bind(this));
        html.find(".delete-purview").on("click", this.deletePurview.bind(this));
        html.find(".add-purview").on("click", this.addPurview.bind(this));

        html.on('change', '.purview-input', this.updatePurview.bind(this));
    }

    async deletePurview(event) {
        event.preventDefault();
        const index = parseInt(event.currentTarget.id);
        this.item.system.purviews.splice(index, 1);
        this.item.update({"system.purviews": this.item.system.purviews});
    }

    async addPurview(_) {
        this.item.system.purviews.push("");
        this.item.update({"system.purviews": this.item.system.purviews});
    }

    async updatePurview(event) {
        const element = event.currentTarget;
        const index = parseInt(element.id.split('-')[1], 10);
        this.item.system.purviews[index] = element.value;
        this.item.update({"system.purviews": this.item.system.purviews});
    }

    /** @inheritdoc */
    async getData(options) {
        const context = await super.getData(options);
        context.descriptionHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(context.item.system.description, {
            secrets: this.document.isOwner,
            async: true
        });
        context.name = context.item.system.name;
        context.description = context.item.system.description;
        context.purviews = context.item.system.purviews ?? [];
        context.startingGear = context.item.system.startingGear ?? [];
        return context;
    }

    /** @inheritdoc */
    async _onDrop(event) {
        const data = foundry.applications.ux.TextEditor.implementation.getDragEventData(event);
        if (data.type !== "Item") return;
        const draggedItem = await fromUuid(data.uuid);

        const disallowedItemTypes = [
            "weapon-type",
            "armor-type",
            "shield-type",
            "injury",
            "calling",
            "species",
            "homeland",
            "history",
            "quirk",
            "ability",
            "advancement"
        ]
        if (disallowedItemTypes.includes(draggedItem.type)) return;
        
        const startingGearArray = this.item.system.startingGear ?? [];
        startingGearArray.push(draggedItem.toObject());
        this.item.update({"system.startingGear": startingGearArray});
    }

    /** @override */
    _getSubmitData(updateData) {
        let formData = super._getSubmitData(updateData);
        return formData;
    }
}
