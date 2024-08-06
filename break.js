/**
 * A BREAK!! system
 * Author: Anyndel
 */

// Import Modules
import { BreakActor } from "./module/actors/actor.js";
import { BreakItem } from "./module/items/item.js";
import { BreakActorSheet } from "./module/actors/actor-sheet.js";
import { preloadHandlebarsTemplates } from "./module/templates.js";
import { createbreakMacro } from "./module/macro.js";
import { BreakToken, BreakTokenDocument } from "./module/token.js";
import { BreakAbilitySheet } from "./module/items/ability-sheet.js";
import { BreakWeaponSheet } from "./module/items/weapon-sheet.js";
import { BreakAdversarySheet } from "./module/actors/adversary-sheet.js";
import { BreakWeaponTypeSheet } from "./module/items/weapon-type-sheet.js";
import { BreakArmorSheet } from "./module/items/armor-sheet.js";
import { BreakArmorTypeSheet } from "./module/items/armor-type-sheet.js";
import { BreakInjurySheet } from "./module/items/injury-sheet.js";
import { ActiveEffectsPanel } from "./module/apps/active-effects-list.js";
import { BreakQuirkSheet } from "./module/items/quirk-sheet.js";
import { BreakGiftSheet } from "./module/items/gift-sheet.js";

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

/**
 * Init hook.
 */
Hooks.once("init", async function() {
  console.log(`Initializing BREAK!! System`);

  /**
   * Set an initiative formula for the system. This will be updated later.
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "1d20",
    decimals: 2
  };

  if (document.querySelector("#ui-top") !== null) {
    // Template element for effects-panel
    const uiTop = document.querySelector("#ui-top");
    const template = document.createElement("template");
    template.setAttribute("id", "break-active-effects-panel");
    uiTop?.insertAdjacentElement("afterend", template);
  }

  game.break = {
    BreakActor,
    createbreakMacro,
    activeEffectPanel: new ActiveEffectsPanel()
  };

  // Define custom Document classes
  CONFIG.Actor.documentClass = BreakActor;
  CONFIG.Item.documentClass = BreakItem;
  CONFIG.Token.documentClass = BreakTokenDocument;
  CONFIG.Token.objectClass = BreakToken;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("break", BreakActorSheet, {types:['character'], makeDefault: true });
  Actors.registerSheet("break", BreakAdversarySheet, {types:['adversary'], makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("break", BreakAbilitySheet, {types:['ability'], makeDefault: true });
  Items.registerSheet("break", BreakWeaponSheet, {types:['weapon'], makeDefault: true });
  Items.registerSheet("break", BreakArmorSheet, {types:['armor'], makeDefault: true });
  Items.registerSheet("break", BreakWeaponTypeSheet, {types:['weapon-type'], makeDefault: true });
  Items.registerSheet("break", BreakArmorTypeSheet, {types:['armor-type'], makeDefault: true });
  Items.registerSheet("break", BreakInjurySheet, {types:['injury'], makeDefault: true });
  Items.registerSheet("break", BreakQuirkSheet, { types: ['quirk'], makeDefault: true });
  Items.registerSheet("break", BreakGiftSheet, { types: ['gift'], makeDefault: true });

  // Register system settings
  game.settings.register("break", "macroShorthand", {
    name: "SETTINGS.SimpleMacroShorthandN",
    hint: "SETTINGS.SimpleMacroShorthandL",
    scope: "world",
    type: Boolean,
    default: true,
    config: true
  });

  // Register initiative setting.
  game.settings.register("break", "initFormula", {
    name: "SETTINGS.SimpleInitFormulaN",
    hint: "SETTINGS.SimpleInitFormulaL",
    scope: "world",
    type: String,
    default: "1d20",
    config: true,
    onChange: formula => _breakUpdateInit(formula, true)
  });

  // Retrieve and assign the initiative formula setting.
  const initFormula = game.settings.get("break", "initFormula");
  _breakUpdateInit(initFormula);

  /**
   * Update the initiative formula.
   * @param {string} formula - Dice formula to evaluate.
   * @param {boolean} notify - Whether or not to post nofications.
   */
  function _breakUpdateInit(formula, notify = false) {
    const isValid = Roll.validate(formula);
    if ( !isValid ) {
      if ( notify ) ui.notifications.error(`${game.i18n.localize("SIMPLE.NotifyInitFormulaInvalid")}: ${formula}`);
      return;
    }
    CONFIG.Combat.initiative.formula = formula;
  }

  /**
   * Slugify a string.
   */
  Handlebars.registerHelper('slugify', function(value) {
    return value.slugify({strict: true});
  });

  Handlebars.registerHelper('sum', function(value1, value2, value3) {
    return value1+value2+value3
  });

  Handlebars.registerHelper('mul', function(value1, value2) {
    return value1*value2
  });

  Handlebars.registerHelper('for', function(from, to, incr, block) {
    var accum = '';
    for(var i = from; i < to; i += incr)
        accum += block.fn(i);
    return accum;
  });

  Handlebars.registerHelper("when", (operand_1, operator, operand_2, options) => {
    let operators = {                     //  {{#when <operand1> 'eq' <operand2>}}
      'eq': (l,r) => l == r,              //  {{/when}}
      'noteq': (l,r) => l != r,
      'gt': (l,r) => (+l) > (+r),                        // {{#when var1 'eq' var2}}
      'gteq': (l,r) => ((+l) > (+r)) || (l == r),        //               eq
      'lt': (l,r) => (+l) < (+r),                        // {{else when var1 'gt' var2}}
      'lteq': (l,r) => ((+l) < (+r)) || (l == r),        //               gt
      'or': (l,r) => l || r,                             // {{else}}
      'and': (l,r) => l && r,                            //               lt
      '%': (l,r) => (l % r) === 0                        // {{/when}}
    }
    let result = operators[operator](operand_1,operand_2);
    if(result) return options.fn(this); 
    return options.inverse(this);       
  });

  // Preload template partials
  await preloadHandlebarsTemplates();
});

/**
 * Macrobar hook.
 */
Hooks.on("hotbarDrop", (bar, data, slot) => createbreakMacro(data, slot));

/**
 * Adds the actor template context menu.
 */
Hooks.on("getActorDirectoryEntryContext", (html, options) => {

  // Define an actor as a template.
  options.push({
    name: game.i18n.localize("SIMPLE.DefineTemplate"),
    icon: '<i class="fas fa-stamp"></i>',
    condition: li => {
      const actor = game.actors.get(li.data("documentId"));
      return !actor.isTemplate;
    },
    callback: li => {
      const actor = game.actors.get(li.data("documentId"));
      actor.setFlag("break", "isTemplate", true);
    }
  });

  // Undefine an actor as a template.
  options.push({
    name: game.i18n.localize("SIMPLE.UnsetTemplate"),
    icon: '<i class="fas fa-times"></i>',
    condition: li => {
      const actor = game.actors.get(li.data("documentId"));
      return actor.isTemplate;
    },
    callback: li => {
      const actor = game.actors.get(li.data("documentId"));
      actor.setFlag("break", "isTemplate", false);
    }
  });
});

/**
 * Adds the item template context menu.
 */
Hooks.on("getItemDirectoryEntryContext", (html, options) => {

  // Define an item as a template.
  options.push({
    name: game.i18n.localize("SIMPLE.DefineTemplate"),
    icon: '<i class="fas fa-stamp"></i>',
    condition: li => {
      const item = game.items.get(li.data("documentId"));
      return !item.isTemplate;
    },
    callback: li => {
      const item = game.items.get(li.data("documentId"));
      item.setFlag("break", "isTemplate", true);
    }
  });

  // Undefine an item as a template.
  options.push({
    name: game.i18n.localize("SIMPLE.UnsetTemplate"),
    icon: '<i class="fas fa-times"></i>',
    condition: li => {
      const item = game.items.get(li.data("documentId"));
      return item.isTemplate;
    },
    callback: li => {
      const item = game.items.get(li.data("documentId"));
      item.setFlag("break", "isTemplate", false);
    }
  });
});

Hooks.once('canvasInit', (canvas) => {
  game.break.activeEffectPanel.render(true);
  Hooks.on("dropCanvasData", (canvas, dropData) => {
    if ( dropData.type === 'Item') {
      const item = game.items.get(dropData.uuid.split('.')[1]);
      const dropTarget = [...canvas.tokens.placeables]
        .sort((a, b) => b.document.sort - a.document.sort)
        .sort((a, b) => b.document.elevation - a.document.elevation)
        .find((t) => t.bounds.contains(dropData.x, dropData.y));
      const actor = dropTarget?.actor;
      if(actor && item.type == "injury") {
        item.effects.forEach(async (effect) => {
          console.log(ActiveEffect);
          const newEffect = ActiveEffect.create({...effect}, {parent: actor});
          console.log(newEffect)
        });
      }
    }
  });
});
