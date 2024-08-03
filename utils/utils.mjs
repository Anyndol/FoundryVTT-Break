/**
 * Handle a delta input for a number value from a form.
 * @param {HTMLInputElement} input  Input that contains the modified value.
 * @param {Document} target         Target document to be updated.
 * @returns {number|void}
 */
export function parseInputDelta(input, target) {
    let value = input.value;
    if ( ["+", "-"].includes(value[0]) ) {
      const delta = parseFloat(value);
      value = Number(foundry.utils.getProperty(target, input.dataset.name ?? input.name)) + delta;
    }
    else if ( value[0] === "=" ) value = Number(value.slice(1));
    if ( Number.isNaN(value) ) return;
    input.value = value;
    return value;
}