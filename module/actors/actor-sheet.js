import { EntitySheetHelper } from "../helper.js";
import {ATTRIBUTE_TYPES, RANK_XP} from "../constants.js";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class BreakActorSheet extends ActorSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["break", "sheet", "actor"],
      template: "systems/break/templates/actor-sheet.html",
      width: 750,
      height: 750,
      tabs: [{navSelector: ".tabs", contentSelector: ".sheet-body", initial: "identity"}],
      scrollY: [".identity", ".items", ".aptitudes"],
      dragDrop: [{dragSelector: ".item-list .item", dropSelector: null}]
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  async getData(options) {
    const context = await super.getData(options);
    context.shorthand = !!game.settings.get("break", "macroShorthand");
    context.dtypes = ATTRIBUTE_TYPES;
    context.biographyHTML = await TextEditor.enrichHTML(context.data.system.biography, {
      secrets: this.document.isOwner,
      async: true
    });

    context.actor.system.hearts.value = context.actor.system.hearts.value ?? context.actor.system.hearts.max;
    for(let i = 0; i < RANK_XP.length; i++){
      if(RANK_XP[i] <= context.actor.system.xp.current){
        context.rank = i+1;
      } else {
        context.xpNextRank = RANK_XP[i]-context.actor.system.xp.current;
        break;
      }
    }
    console.log(context.actor.items.filter(i => i.type === "ability"))
    context.abilities = context.actor.items.filter(i => i.type === "ability");
    return context;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if ( !this.isEditable ) return;

    html.find(".aptitude-container").on("click", ".aptitude-trait", this._onSetTrait.bind(this));
    html.find("#newability").on("click", this._onAddAbility.bind(this));
    html.find(".delete-ability").on("click", this._onDeleteAbility.bind(this));

    // Add draggable for Macro creation
    html.find(".aptitudes a.aptitude-roll").each((i, a) => {
      a.setAttribute("draggable", true);
      a.addEventListener("dragstart", ev => {
        let dragData = ev.currentTarget.dataset;
        ev.dataTransfer.setData('text/plain', JSON.stringify(dragData));
      }, false);
    });
  }

  /* -------------------------------------------- */

  async _onSetTrait(event) {
    event.preventDefault();
    const button = event.currentTarget;
    console.log(button.parentElement.children[1]);
    const aptitude = button.parentElement.children[1].dataset.aptitude;
    console.log(aptitude);
    const value = button.dataset.option;
    console.log(value)
    if(aptitude == undefined || value == undefined) {
      return;
    }
    console.log(this.actor)
    console.log(this.actor.items.get)
    //this.actor.system.aptitudes[aptitude].trait = Number(value)
    //this._onSubmit(event)
    //this.render(true)
    this.actor.setAptitudeTrait(aptitude, +value)
  }

  async _onAddAbility(event) {
    event.preventDefault();
    this.actor.addNewAbility();
  }

  async _onDeleteAbility(event) {
    event.preventDefault();
    const button = event.currentTarget;
    const id = button.dataset.id;
    console.log(id);
    this.actor.deleteAbility(id);
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
    //formData = EntitySheetHelper.updateAptitudes(formData, this.object);
    //formData = EntitySheetHelper.updateGroups(formData, this.object);
    return formData;
  }
}
