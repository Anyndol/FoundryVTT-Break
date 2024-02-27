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

  async deleteAbility(id) {
    const ability = this.items.find(i => i._id == id);
    if(ability) {
      ability.delete()
    }
    return this
  }
}