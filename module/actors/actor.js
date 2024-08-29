import { AdvantageTypes, RollBonuses, RollType, calculateRollResult, getResultText, roll } from "../../utils/dice.js";
import { EntitySheetHelper } from "../helper.js";

/**
 * Extend the base Actor document to support aptitudes and groups with a custom template creation dialog.
 * @extends {Actor}
 */
export class BreakActor extends Actor {

  /** @inheritdoc */
  prepareDerivedData() {
    super.prepareDerivedData();
  }

  async _preCreate(data, options, user) {

    await super._preCreate(data, options, user);

    let initData = {};

    if (data.type === "character") {
      initData["prototypeToken.actorLink"] = true;
    }

    this.updateSource(initData);
  }

  prepareData(){
    super.prepareData();

    if(canvas.ready) {
      const thisTokenIsControlled = canvas.tokens.controlled.some(
        (t) => t.document.actorId == this._id);

      if (thisTokenIsControlled) {
        game.break.activeEffectPanel.render();
      }
    }
  }
  
  async setAptitudeTrait(aptitudeKey, traitValue) {
    const updates = {};
    updates[`system.aptitudes.${aptitudeKey}.trait`] = traitValue;
    await this.update(updates)
    return this
  }

  async deleteItem(id) {
    const item = this.items.find(i => i._id == id);
    if(item) {
      item.delete()
    }
    return this
  }

  async rollAptitude(aptitudeId) {
    const aptitude = this.system.aptitudes[aptitudeId];
    const flavor = game.i18n.format("BREAK.AptitudeCheck", {aptitude:  game.i18n.localize(aptitude.label)});
    const targetValue = +aptitude.value + +aptitude.bon + +aptitude.trait;

    new Dialog({
      title: "Roll " +game.i18n.localize(aptitude.label)+ " check",
      content: await renderTemplate("systems/break/templates/rolls/roll-dialog.hbs",{bonuses: RollBonuses, aptitude: true}),
      buttons: {
        roll: {
          label: game.i18n.localize("BREAK.Roll"),
          callback: async (html) => {
            const form = html[0].querySelector("form");
            return roll(flavor, form.rollType.value, targetValue, form.edge.value, form.bonus.value, form.customBonus.value);
          }
        }
      }
    }).render(true);
  }

  async rollAttack(bonus, extraDamage) {
    const attack = +this.system.attack.value + +this.system.attack.bon + +bonus;
    const flavor = game.i18n.format("BREAK.Attack");
    new Dialog({
      title: "Roll attack",
      content: await renderTemplate("systems/break/templates/rolls/roll-dialog.hbs",{bonuses: RollBonuses}),
      buttons: {
        roll: {
          label: game.i18n.localize("BREAK.Roll"),
          callback: async (html) => {
            const form = html[0].querySelector("form");
            return roll(flavor, RollType.ATTACK, +extraDamage, form.edge.value, form.bonus.value, form.customBonus.value, attack);
          }
        }
      }
    }).render(true);
  }

  async modifyHp(amount) {
    if(this.system.hearts.value + amount >= 0 && this.system.hearts.value + amount <= (this.system.hearts.max + this.system.hearts.bon)) {
      const updates = {"system.hearts.value": this.system.hearts.value+amount}
      await this.update(updates)
    }
    return this
  }

  /** @inheritdoc */
  async _onUpdate(data, options, userId) {
    super._onUpdate(data, options, userId);
    console.log(data);
    if(data.system?.hearts?.bon != null && (this.system.hearts.max + data.system.hearts.bon) < this.system.hearts.value) {
      this.update({"system.hearts.value": this.system.hearts.max + data.system.hearts.bon})
    }
  }

}