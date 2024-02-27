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

  async addNewAbility() {
    const abilities = [...this.system.abilities] ?? [];
    abilities.push("");
    const updates = {};
    updates[`system.abilities`] = abilities;
    await this.update(updates)
    return this
  }

  async deleteAbility(index) {
    const abilities = [...this.system.abilities] ?? [];
    console.log(index);
    if(abilities.length > index){
      abilities.splice(index, 1);
      const updates = {};
      updates[`system.abilities`] = abilities;
      await this.update(updates)
    }
    return this
  }
}