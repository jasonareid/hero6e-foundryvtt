import { HeroSystem6eActorActiveEffects } from "./actor-active-effects.js"
/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class HeroSystem6eActor extends Actor {

    /** @inheritdoc */
    async _preCreate(data, options, user) {
        await super._preCreate(data, options, user);

        //TODO: Add user configuration for initial prototype settings

        let prototypeToken = {
            // Leaving sight disabled.
            // TODO: Implement various Enhanced Visions
            // sight: { enabled: true }, 
            bar1: { attribute: "characteristics.body" },
            bar2: { attribute: "characteristics.stun" },
            displayBars: CONST.TOKEN_DISPLAY_MODES.HOVER,
            displayName: CONST.TOKEN_DISPLAY_MODES.HOVER,
        };


        if (this.type === "pc") {
            prototypeToken = {
                ...prototypeToken,
                actorLink: true,
                disposition: CONST.TOKEN_DISPOSITIONS.FRIENDLY,
                displayBars: CONST.TOKEN_DISPLAY_MODES.ALWAYS,
                displayName: CONST.TOKEN_DISPLAY_MODES.HOVER,

            };

        }

        this.updateSource({ prototypeToken });

    }

    // Adding ActiveEffects seems complicated.
    // Make sure only one of the same ActiveEffect is added
    // Assumes ActiveEffect is a statusEffects.
    // TODO: Allow for a non-statusEffects ActiveEffect (like from a power)
    async addActiveEffect(activeEffect) {

        const newEffect = deepClone(activeEffect)
        newEffect.label = `${game.i18n.localize(newEffect.label)}`
        newEffect.flags = { core: { statusId: activeEffect.id } }

        // Check if this ActiveEffect already exists
        const existingEffect = this.effects.find(o => o.flags?.core?.statusId === activeEffect.id);
        if (existingEffect) {
            //console.log(activeEffect.id + " already exists")
            return
        }


        await this.createEmbeddedDocuments("ActiveEffect", [newEffect])

    }


    /**
     * Augment the basic actor data with additional dynamic data.
     */
    // prepareData() {
    //     super.prepareData();

    //     console.log(this)
    //     const actorData = this.system;
    //     // const data = actorData.data;
    //     // const flags = actorData.flags;

    //     // Make separate methods for each Actor type (character, npc, etc.) to keep
    //     // things organized.
    //     //if (actorData.type === 'character') 
    //     // All actors get same basic data (for now)
    //     // Might change when/if vehicles/robots are significantly different
    //     this._prepareCharacterData(actorData);


    // }

    /**
     * Prepare Character type specific data
     */
    // _prepareCharacterData(actorData) {
    //     const data = actorData;

    //     // Make modifications to data here. For example:

    //     // Loop through characteristics, and add their rolls to our sheet output.
    //     for (let [key, characteristic] of Object.entries(data.characteristics)) {
    //         characteristic.roll = Math.round(9 + (characteristic.value / 5));
    //     }

    //     this._prepareResource(data.body, data.characteristics['body']);
    //     this._prepareResource(data.stun, data.characteristics['stun']);
    //     this._prepareResource(data.end, data.characteristics['end']);

    //     for (let [key, characteristic] of Object.entries(data.characteristics)) {
    //         this._prepareCharacteristic(characteristic);
    //     }
    // }

    // _prepareCharacteristic(characteristic) {
    //     if (characteristic.modifier) {
    //         characteristic.value *= characteristic.modifier;
    //     }

    //     characteristic.value = Math.round(characteristic.value);
    // }

    // _prepareResource(resource, characteristic) {
    //     resource.max = characteristic.value;
    // }

    /** @override */
    // applyActiveEffects() {
    //     // The Active Effects do not have access to their parent at preparation time so we wait until this stage to
    //     // determine whether they are suppressed or not.
    //     return super.applyActiveEffects();
    // }

    // _onUpdate(data, options, userId) {
    //     super._onUpdate(data, options, userId);
    // }

    static migrateData(data) {
        if (data.type === 'character') {
            let token = data.prototypeToken || data.token
            if (token) {
                if (token.disposition == CONST.TOKEN_DISPOSITIONS.FRIENDLY) {
                    data.type = "pc"
                }
                else {
                    data.type = "npc"
                }
            }
        }
        return super.migrateData(data);
    }

}