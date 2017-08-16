import {
    IGameState,
} from './Header';
import {
    EntityCode,
} from '../Entity/Header';
import { IPlayerResponse } from '../Player/Header';
import { IEffectPack } from '../Event/Header';
import { ApplyEffect } from '../Event/Effect';
import { CheckFilter } from '../Event/Filter';
import { ApplyMutator } from '../Event/Mutator';

export abstract class GameMachine {
    constructor(public state: IGameState) { }

    /**
     * tick runs the game for one discrete step.
     *
     * That means we execute exactly the top-most event from
     * the stack. The individual Effects of that event may be
     * intercepted. This can result in those events being preempted
     * with additional events, being canclled, or otherwise being
     * mutated.
     */
    public tick() {
        let event = this.state.stack.pop();
        if (event === null) throw Error('cannot tick with popped null event');

        // Execute the effects from top down
        event.Effects.forEach(e => {
            this.executeEffect(e);
        });
    }

    /**
     * executeEffect executes a single Effect from an Event.
     *
     * All matching interceptors will be applied to the EffectPack.
     */
    public executeEffect(e: IEffectPack) {
        let mutated = this.state.interceptors.reduce((packs, intercept) => {
            let intercepted = packs.map(p => {
                if (!CheckFilter(p, intercept.Filter)) return [p];
                return ApplyMutator(p, intercept.Mutator);
            });
            let flat = intercepted.reduce((total, parts) => {
                total.push(...parts);
                return total;
            }, []);
            return flat;
        }, [e]);

        mutated.forEach(m => {
            if (m === null) return;
            this.state = ApplyEffect(m, this.state,
                (player: EntityCode) => this.getPlayerResponse(player));
        });
    }

    public abstract getPlayerResponse(player: EntityCode): IPlayerResponse;
}
