const {
    HTMLField, SchemaField, NumberField, StringField, FilePathField, ArrayField
} = foundry.data.fields;

class CharacterData extends foundry.abstract.TypeDataModel {
static defineSchema() {
    return {
        biography: new HTMLField(),
        notes: new HTMLField(),
        attack: new SchemaField({
            value: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
            bon: new NumberField({ required: true, integer: true, initial: 0 }),
        }),
        defense: new SchemaField({
            value: new NumberField({ required: true, integer: true, min: 0, initial: 10 }),
            bon: new NumberField({ required: true, integer: true, initial: 0 }),
        }),
        speed: new SchemaField({
            value: new NumberField({ required: true, integer: true, min: 0, initial: 1 }),
            bon: new NumberField({ required: true, integer: true, initial: 0 }),
        }),
        hearts: new SchemaField({
            value: new NumberField({ required: true, integer: true, min: 0, initial: 1 }),
            max: new NumberField({ required: true, integer: true, min: 1, initial: 1 }),
            bon: new NumberField({ required: true, integer: true, initial: 0 }),
        }),
        aptitudes: new SchemaField({
            might: new SchemaField({
                base: new NumberField({ required: true, integer: true, min: 0, initial: 10 }),
                bon: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
                trait: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
                description: new StringField({initial: "BREAK.APTITUDE.MightDesc", readOnly: true, blank: false}),
                label: new StringField({initial: "BREAK.APTITUDE.Might", readOnly: true, blank: false}),
                color: new StringField({initial: "rgb(238, 61, 52) !important;", readOnly: true, blank: false}),
            }),
            deftness: new SchemaField({
                base: new NumberField({ required: true, integer: true, min: 0, initial: 10 }),
                bon: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
                trait: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
                description: new StringField({initial: "BREAK.APTITUDE.DeftnessDesc", readOnly: true, blank: false}),
                label: new StringField({initial: "BREAK.APTITUDE.Deftness", readOnly: true, blank: false}),
                color: new StringField({initial: "rgb(244, 127, 38) !important;", readOnly: true, blank: false}),
            }),
            grit: new SchemaField({
                base: new NumberField({ required: true, integer: true, min: 0, initial: 10 }),
                bon: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
                trait: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
                description: new StringField({initial: "BREAK.APTITUDE.GritDesc", readOnly: true, blank: false}),
                label: new StringField({initial: "BREAK.APTITUDE.Grit", readOnly: true, blank: false}),
                color: new StringField({initial: "rgb(93, 186, 72) !important;", readOnly: true, blank: false}),
            }),
            insight: new SchemaField({
                base: new NumberField({ required: true, integer: true, min: 0, initial: 10 }),
                bon: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
                trait: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
                description: new StringField({initial: "BREAK.APTITUDE.InsightDesc", readOnly: true, blank: false}),
                label: new StringField({initial: "BREAK.APTITUDE.Insight", readOnly: true, blank: false}),
                color: new StringField({initial: "rgb(23, 126, 194) !important;", readOnly: true, blank: false}),
            }),
            aura: new SchemaField({
                base: new NumberField({ required: true, integer: true, min: 0, initial: 10 }),
                bon: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
                trait: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
                description: new StringField({initial: "BREAK.APTITUDE.AuraDesc", readOnly: true, blank: false}),
                label: new StringField({initial: "BREAK.APTITUDE.Aura", readOnly: true, blank: false}),
                color: new StringField({initial: "rgb(108, 60, 148) !important;", readOnly: true, blank: false}),
            }),
        }),
        allegiance: new SchemaField({
            dark: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
            bright: new NumberField({ required: true, integer: true, min:0, initial: 0 }),
        }),
        xp: new SchemaField({
            rank: new NumberField({ required: true, integer: true, min: 1, initial: 1 }),
            current: new NumberField({ required: true, integer: true, min:0, initial: 0 }),
        }),
        languages: new StringField({initial: "", blank: false}),
        purviews: new StringField({initial: "", blank: false}),
        slots: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
        currency: new SchemaField({
            gems: new NumberField({ required: true, integer: true, min:0, initial: 0 }),
            coins: new NumberField({ required: true, integer: true, min:0, initial: 0 }),
            stones: new NumberField({ required: true, integer: true, min:0, initial: 0 }),
        }),
    };
}
}