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

  async sendToChat() {
    const itemData = foundry.utils.duplicate(this.system);
    itemData.name = this.name;
    itemData.itemType = this.type;
    itemData.img = this.img;
    itemData.isWeapon = this.type === "weapon";
    itemData.isArmor = this.type === "armor";
    itemData.isArmor = this.type === "armor";
    itemData.isAbility = this.type === "ability";
    itemData.isQuirk = this.type === "quirk";
    itemData.isGift = this.type === "gift";
    itemData.isRanged = this.system.weaponType1?.system.ranged || this.system.weaponType2?.system.ranged;
    itemData.isMelee = (this.system.weaponType1 && !this.system.weaponType1.system.ranged) || (this.system.weaponType2 && !this.system.weaponType2.system.ranged);
    itemData.isGear = this.type != "quirk" && this.type != "ability" && this.type != "calling" && this.type != "gift";

    const html = await renderTemplate("systems/break/templates/chat/item.html", itemData);
    const chatData = {
      user: game.user.id,
      rollMode: game.settings.get("core", "rollMode"),
      content: html,
    }

    if (["gmroll", "blindroll"].includes(chatData.rollMode)) {
      chatData.whisper = ChatMessage.getWhisperRecipients("GM");
    } else if (chatData.rollMode === "selfroll") {
      chatData.whisper = [game.user];
    }
    ChatMessage.create(chatData);
  }
}
