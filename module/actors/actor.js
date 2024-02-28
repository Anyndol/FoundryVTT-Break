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

  async rollAttack() {
    const attack = +this.system.attack.value + +this.system.attack.bon;
    const flavor = game.i18n.format("BREAK.Attack");
    new Dialog({
      title: "Roll attack",
      content: await renderTemplate("systems/break/templates/rolls/roll-dialog.hbs",{bonuses: RollBonuses}),
      buttons: {
        roll: {
          label: game.i18n.localize("BREAK.Roll"),
          callback: async (html) => {
            const form = html[0].querySelector("form");
            return roll(flavor, RollType.ATTACK, 0, form.edge.value, form.bonus.value, form.customBonus.value, attack);
          }
        }
      }
    }).render(true);
  }

}