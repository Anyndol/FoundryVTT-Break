export const RollResults = {
    SUCCESS: 0,
    FAILURE: 1,
    AUTOMATIC_FAILURE: 2,
    SPECIAL_SUCCESS: 3
}

export const RollBonuses = {
    NONE: 0,
    MINOR_BONUS: 1,
    MAJOR_BONUS: 2,
    MINOR_PENALTY: 3,
    MAJOR_PENALTY: 4
}

export const AdvantageTypes = {
    NONE: 0,
    EDGE: 1,
    SNAG: 2
}

export function calculateRollResult(targetValue, rollBase, rollTotal){
    if(targetValue == rollBase) {
        return RollResults.SPECIAL_SUCCESS;
    }
    if(rollTotal <= targetValue) {
        return RollResults.SUCCESS;
    }
    if(rollBase === 20) {
        return RollResults.AUTOMATIC_FAILURE;
    }
    return RollResults.FAILURE;
}

export function getResultText(result){
    switch(result){
        case RollResults.AUTOMATIC_FAILURE:
            return game.i18n.format("BREAK.AutomaticFailure");
        case RollResults.FAILURE:
            return game.i18n.format("BREAK.Failure");
        case RollResults.SUCCESS:
            return game.i18n.format("BREAK.Success");
       case RollResults.SPECIAL_SUCCESS:
            return game.i18n.format("BREAK.SpecialSuccess");
    }
}

export async function roll(flavor, targetValue, advantageType, isLowRoll, bonusType, customBonus) {
    let rollFormula = "1d20";

    if(advantageType != null) {
        switch(+advantageType) {
            case AdvantageTypes.EDGE:
                if(isLowRoll)
                    rollFormula = "2d20kl"
                else
                    rollFormula = "2d20kh"
                break;
            case AdvantageTypes.SNAG:
                if(isLowRoll)
                    rollFormula = "2d20kh"
                else
                    rollFormula = "2d20kl"
                break;
        }
    }

    if(bonusType != null) {
        switch(+bonusType){
            case RollBonuses.MINOR_BONUS:
                if(isLowRoll)
                    rollFormula += " -2"
                else
                    rollFormula += " +2"
                break;
            case RollBonuses.MAJOR_BONUS:
                if(isLowRoll)
                    rollFormula += " -4"
                else
                    rollFormula += " +4"
                break;
            case RollBonuses.MINOR_PENALTY:
                if(isLowRoll)
                    rollFormula += " +2"
                else
                    rollFormula += " -2"
                break;
            case RollBonuses.MAJOR_PENALTY:
                if(isLowRoll)
                    rollFormula += " +4"
                else
                    rollFormula += " -4"
                break;
        }
    }

    if(customBonus != null) {
        if(isLowRoll)
            rollFormula += " - @customBonus"
        else
            rollFormula += " + @customBonus"
    }

    const roll = new Roll(rollFormula, {customBonus})
    await roll.evaluate();
    const resultText = getResultText(calculateRollResult(targetValue, roll.total, roll.total))
    return roll.toMessage({
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actor: this }),
        content: await renderTemplate("systems/break/templates/rolls/roll-check.hbs", 
        {
            roll: roll,
            outcome: resultText
        }),
        flavor,
    });
}