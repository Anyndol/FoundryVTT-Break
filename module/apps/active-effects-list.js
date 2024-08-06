export class ActiveEffectsPanel extends Application {
    get token(){
        return canvas.tokens.controlled.at(0)?.document ?? null;
    }

    get actor() {
        return this.token?.actor ?? game.user?.character ?? null;
    }

    static get defaultOptions() {
        return {
            ...super.defaultOptions,
            id: "break-active-effects-panel",
            popOut: false,
            template: "systems/break/templates/system/active-effects-panel.hbs",
        };
    }

    async getData(options) {
        const { actor } = this;
        if (!actor) {
            return {
                effects: [],
            };
        }

        const effects = this.actor.effects;
        return {effects};
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.find("div.effect-item").on("contextmenu", this._removeEffect.bind(this));
    }

    async _removeEffect(event) {
        event.preventDefault();
        const id = event.target.closest('[data-item-id]').dataset.itemId;
        this.actor.deleteEmbeddedDocuments("ActiveEffect", [id]);
    }

}
