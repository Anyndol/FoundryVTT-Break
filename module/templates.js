/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function() {

  // Define template paths to load
  const templatePaths = [
    // Attribute list partial.
    "systems/break/templates/actors/templates/sheet-aptitudes.html",
    "systems/break/templates/actors/templates/sheet-identity.hbs",
    "systems/break/templates/actors/templates/sheet-combat.html",
    "systems/break/templates/actors/templates/sheet-abilities.html",
    "systems/break/templates/actors/templates/sheet-xp.html",
    "systems/break/templates/actors/templates/sheet-allegiance.html",
    "systems/break/templates/actors/templates/sheet-weapon-card.hbs",
    "systems/break/templates/actors/templates/sheet-equipment.hbs",
    "systems/break/templates/actors/templates/sheet-bag-content.hbs",
    "systems/break/templates/actors/templates/sheet-bags.hbs",
    "systems/break/templates/actors/adversary/parts/adversary-misc.hbs",
    "systems/break/templates/actors/adversary/parts/sheet-combat.html",
    "systems/break/templates/actors/adversary/parts/simplified-sheet-aptitudes.html",
    "systems/break/templates/rolls/roll-check.hbs",
    "systems/break/templates/rolls/roll-dialog.hbs",
    "systems/break/templates/items/item-header.hbs",
    "systems/break/templates/items/generic-header.hbs",
    "systems/break/templates/items/parts/item-abilities.hbs",
    "systems/break/templates/items/parts/weapon-details.hbs",
    "systems/break/templates/items/parts/weapon-type-details.hbs",
    "systems/break/templates/items/parts/armor-details.hbs",
    "systems/break/templates/items/parts/shield-details.hbs",
    "systems/break/templates/items/parts/advancement-table.hbs",
    "systems/break/templates/actors/templates/sheet-equipment-card.hbs",
    "systems/break/templates/system/active-effects-panel.hbs"
  ];

  // Load the template parts
  return loadTemplates(templatePaths);
};