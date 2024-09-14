import { BreakItemSheet } from "./item-sheet.js";

export class BreakCallingSheet extends BreakItemSheet {

    /** @inheritdoc */
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        classes: ["break", "sheet", "calling"],
        template: "systems/break/templates/items/calling-sheet.hbs",
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

        return context;
    }

    /** @inheritdoc */
    async _onDrop(event) {
        // const data = TextEditor.getDragEventData(event);
        // if(data.type !== "Item") return;
        // const draggedItem = await fromUuid(data.uuid);
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