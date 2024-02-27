//import { EntitySheetHelper } from "../helper";

/**
 * Extend the base Item document to support aptitudes and groups with a custom template creation dialog.
 * @extends {Item}
 */
export class BreakItem extends Item {

  /** @inheritdoc */
  prepareDerivedData() {
    super.prepareDerivedData();
  }

  /*static async createDialog(data={}, options={}) {
    // Create the dialog, temporarily changing the list of allowed items
    console.log(game)
    const original = game.system.documentTypes.Item;
    try {
        game.system.documentTypes.Item = original;
        return super.createDialog(data, {
            ...context,
            classes: [...(context.classes ?? []), "dialog-item-create"],
        });
    } finally {
        game.system.documentTypes.Item = original;
    }
  }*/

}
