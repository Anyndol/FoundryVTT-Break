import { BreakItemSheet } from "./item-sheet.js";

export class BreakSpeciesSheet extends BreakItemSheet {

    /** @inheritdoc */
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        classes: ["break", "sheet", "species"],
        template: "systems/break/templates/items/species-sheet.hbs",
        width: 600,
        height: 480,
        dragDrop: [{dragSelector: null, dropSelector: null}]
      });
    }
  
    /** @inheritdoc */
    activateListeners(html) {
      super.activateListeners(html);
      if ( !this.isEditable ) return;
      html.find(".delete-size").on("click", this.onDeleteSize.bind(this));
      html.find(".delete-innate-ability").on("click", this.onDeleteInnateAbility.bind(this));
      html.find(".delete-maturative-ability").on("click", this.onDeleteMaturativeAbility.bind(this));
    }

    async onDeleteSize(event) {
      event.preventDefault();
      this.item.update({"system.size": null});
    }

    async onDeleteInnateAbility(event) {
      event.preventDefault();
      const index = parseInt(event.currentTarget.id.split('-')[1], 10);
      this.item.system.innateAbilities.splice(index, 1);
      this.item.update({"system.innateAbilities": this.item.system.innateAbilities});
    }

    async onDeleteMaturativeAbility(_) {
      event.preventDefault();
      this.item.update({"system.maturativeAbility": null});
    }

    /** @inheritdoc */
    async getData(options) {
        const context = await super.getData(options);
        context.descriptionHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(context.item.system.description, {
            secrets: this.document.isOwner,
            async: true
        });

        context.innateAbilities = this.item.system.innateAbilities ?? [];
        context.hasInnateAbilities = context.innateAbilities.length > 0;
        context.maturativeAbility = this.item.system.maturativeAbility;
        return context;
    }

    /** @inheritdoc */
    async _onDrop(event) {
      const data = foundry.applications.ux.TextEditor.implementation.getDragEventData(event);
      if(data.type !== "Item") return;
      const draggedItem = await fromUuid(data.uuid);

      if(draggedItem.type === "size") {
        this.item.update({"system.size": draggedItem.toObject()})
      } else if(draggedItem.type === "ability") {
        if(event.target.id === "innateAbilities") {
          const ia = this.item.system.innateAbilities ?? [];
          ia.push(draggedItem.toObject());
          this.item.update({"system.innateAbilities": ia});
        } else if (event.target.id === "maturativeAbility") {
          this.item.update({"system.maturativeAbility": draggedItem.toObject()})
        }
      }
    }

    /** @override */
    _getSubmitData(updateData) {
        let formData = super._getSubmitData(updateData);
        return formData;
    }
}
