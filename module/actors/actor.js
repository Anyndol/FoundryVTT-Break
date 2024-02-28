import { AdvantageTypes, calculateRollResult, getResultText, roll } from "../../utils/dice.js";
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
      content: await renderTemplate("systems/break/templates/rolls/roll-dialog.hbs",{}),
      buttons: {
        roll: {
          label: game.i18n.localize("BREAK.Roll"),
          callback: async (html) => {
            const form = html[0].querySelector("form");
            return roll(flavor, targetValue, form.edge.value, true, form.bonus.value, form.customBonus.value)
          }
        }
      }
    }).render(true);
  }

}