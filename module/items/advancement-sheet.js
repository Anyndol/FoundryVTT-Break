import { BreakItemSheet } from "./item-sheet.js";
import BREAK from "../constants.js";

export class BreakAdvancementSheet extends BreakItemSheet {

    /** @inheritdoc */
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        classes: ["break", "sheet", "advancement"],
        template: "systems/break/templates/items/advancement-sheet.hbs",
        width: 650,
        height: 520,
        dragDrop: [{dragSelector: null, dropSelector: null}]
      });
    }

    generateEmptyAdvancementTable() {
        let rankOrdinals = ["st", "nd", "rd", "th"];
        let advTable = {};
        for (let rank = 0; rank < BREAK.max_rank; ++rank) {
            let ordinal = Math.min(rank, 3);
            let statArray = {
                rank: (rank + 1).toString() + rankOrdinals[ordinal],
                attack: 0,
                hearts: 0,
                might: 0,
                deftness: 0,
                grit: 0,
                insight: 0,
                aura: 0,
                startingAbilites: 0,
                standardAbilities: 0,
                advancedAbilities: 0,
                xp: 0
            };
            advTable[rank] = statArray;
        }
        return advTable;
    }
  
    /** @inheritdoc */
    activateListeners(html) {
      super.activateListeners(html);
      if ( !this.isEditable ) return;
      html.find(".delete-ability").on("click", this.item.onDeleteAbility.bind(this));

      html.on('change', '.advancement-input', this.updateAdvancement.bind(this));
    }

    async updateAdvancement(event) {
        const element = event.currentTarget;

        if (this.item.system.table == null) {
            this.item.system.table = this.generateEmptyAdvancementTable();
        }

        let idParts = element.id.split('-');
        let stat = idParts[0];
        let index = parseInt(idParts[1], 10);

        let value = parseInt(element.value, 10);
        switch(stat) {
            case "attack":
                this.item.system.table[index].attack = value;
                break;
            case "hearts":
                this.item.system.table[index].hearts = value;
                break;
            case "might":
                this.item.system.table[index].might = value;
                break;
            case "deftness":
                this.item.system.table[index].deftness = value;
                break;
            case "grit":
                this.item.system.table[index].grit = value;
                break;
            case "insight":
                this.item.system.table[index].insight = value;
                break;
            case "aura":
                this.item.system.table[index].aura = value;
                break;
            case "startingAbilites":
                this.item.system.table[index].startingAbilites = value;
                break;
            case "standardAbilities":
                this.item.system.table[index].standardAbilities = value;
                break;
            case "advancedAbilities":
                this.item.system.table[index].advancedAbilities = value;
                break;
            case "xp":
                this.item.system.table[index].xp = value;
                break;
        }

        this.item.update({"system.table": this.item.system.table});
    }

    /** @inheritdoc */
    async getData(options) {
        const context = await super.getData(options);
        context.descriptionHTML = await TextEditor.enrichHTML(context.item.system.description, {
            secrets: this.document.isOwner,
            async: true
        });

        let advTable = context.item.system.table;
        if (advTable == null) {
            advTable = this.generateEmptyAdvancementTable();
            context.item.system.table = advTable;
        }
        context.advancementTable = advTable;
        context.advancementTableEditable = true;

        return context;
    }

    /** @inheritdoc */
    async _onDrop(_) {}

    /** @override */
    _getSubmitData(updateData) {
        let formData = super._getSubmitData(updateData);
        return formData;
    }
}