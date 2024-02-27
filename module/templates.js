/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function() {

  // Define template paths to load
  const templatePaths = [
    // Attribute list partial.
    "systems/break/templates/parts/sheet-aptitudes.html",
    "systems/break/templates/parts/sheet-identity.html",
    "systems/break/templates/parts/sheet-combat.html",
    "systems/break/templates/parts/sheet-abilities.html",
    "systems/break/templates/parts/sheet-xp.html",
    "systems/break/templates/parts/sheet-allegiance.html",
  ];

  // Load the template parts
  return loadTemplates(templatePaths);
};