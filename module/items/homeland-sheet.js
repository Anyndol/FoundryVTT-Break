import { BreakItemSheet } from "./item-sheet.js";

export class BreakHomelandSheet extends BreakItemSheet {

    /** @inheritdoc */
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        classes: ["break", "sheet", "homeland"],
        template: "systems/break/templates/items/homeland-sheet.hbs",
        width: 600,
        height: 480,
        dragDrop: [{dragSelector: null, dropSelector: null}]
      });
    }
  
    /** @inheritdoc */
    activateListeners(html) {
      super.activateListeners(html);
      if ( !this.isEditable ) return;
      html.find(".delete-history").on("click", this.onDeleteHistory.bind(this));
    }

    async onDeleteHistory(event) {
        event.preventDefault();
        const button = event.currentTarget;
        const id = button.dataset.id;
    
        const itemIndex = this.item.system.histories?.findIndex(i => i._id == id);
        if(itemIndex >= 0) {
          this.item.system.histories.splice(itemIndex, 1);
          this.item.update({"system.histories": this.item.system.histories});
        }
      }

    /** @inheritdoc */
    async getData(options) {
        const context = await super.getData(options);
        context.descriptionHTML = await TextEditor.enrichHTML(context.item.system.description, {
            secrets: this.document.isOwner,
            async: true
        });
        this.item.system.bonusLanguages = "";
        context.bonusLanguages = context.item.system.bonusLanguages;
        context.histories = context.item.system.histories ?? [];
        return context;
    }

    /** @inheritdoc */
    async _onDrop(event) {
        const data = TextEditor.getDragEventData(event);
        if(data.type !== "Item") return;
        const draggedItem = await fromUuid(data.uuid);
        if(draggedItem.type === "history") {
            const historyArray = this.item.system.histories ?? [];
            historyArray.push(draggedItem.toObject());
            this.item.update({"system.histories": historyArray});
        }
    }

    /** @override */
    _getSubmitData(updateData) {
        let formData = super._getSubmitData(updateData);
        return formData;
    }
}
