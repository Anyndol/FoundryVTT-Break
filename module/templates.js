/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function() {

  // Define template paths to load
  const templatePaths = [
    // Attribute list partial.
    "systems/break/templates/actors/parts/sheet-aptitudes.html",
    "systems/break/templates/actors/parts/sheet-identity.html",
    "systems/break/templates/actors/parts/sheet-combat.html",
    "systems/break/templates/actors/parts/sheet-abilities.html",
    "systems/break/templates/actors/parts/sheet-xp.html",
    "systems/break/templates/actors/parts/sheet-allegiance.html",
    "systems/break/templates/actors/parts/sheet-weapon-card.hbs",
    "systems/break/templates/actors/parts/sheet-equipment.hbs",
    "systems/break/templates/actors/parts/sheet-bag-content.hbs",
    "systems/break/templates/actors/parts/sheet-bags.hbs",
    "systems/break/templates/actors/adversary/parts/adversary-misc.hbs",
    "systems/break/templates/actors/adversary/parts/sheet-combat.html",
    "systems/break/templates/actors/adversary/parts/simplified-sheet-aptitudes.html",
    "systems/break/templates/rolls/roll-check.hbs",
    "systems/break/templates/rolls/roll-dialog.hbs",
    "systems/break/templates/items/item-header.hbs",
    "systems/break/templates/items/generic-header.hbs",
    "systems/break/templates/items/parts/item-abilities.hbs",
    "systems/break/templates/items/parts/weapon-details.hbs",
    "systems/break/templates/items/parts/armor-details.hbs",
    "systems/break/templates/items/parts/shield-details.hbs",
    "systems/break/templates/items/parts/advancement-table.hbs",
    "systems/break/templates/actors/parts/sheet-equipment-card.hbs",
    "systems/break/templates/system/active-effects-panel.hbs"
  ];

  // Load the template parts
  return loadTemplates(templatePaths);
};