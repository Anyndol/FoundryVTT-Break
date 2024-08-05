/**
 * Extend the base Item document to support aptitudes and groups with a custom template creation dialog.
 * @extends {Item}
 */
export class BreakItem extends Item {

  /** @inheritdoc */
  prepareDerivedData() {
    super.prepareDerivedData();
  }

  async onDeleteAbility(event) {
    event.preventDefault();
    const button = event.currentTarget;
    const id = button.dataset.id;
    const itemIndex = this.item.system.abilities?.findIndex(i => i._id == id);
    if(itemIndex >= 0) {
      this.item.system.abilities.splice(itemIndex, 1);
      this.item.update({"system.abilities": this.item.system.abilities});
    }
  }

  mergeAndPruneAbilities(newAbilities) {
    let abilityArray = this.system.abilities ?? [];
    abilityArray = abilityArray.concat(newAbilities);
    const prunedAbilities = [];
    abilityArray.reduce((pa, a) => {
      if(!pa.some(i => a._id === i._id))
        pa.push(a);
      return pa;
    }, prunedAbilities);
    return prunedAbilities;
  }

  async deleteEffect(id) {
    const effect = this.effects.find(i => i._id == id);
    if(effect) {
      effect.delete()
    }
    return this
  }

}
