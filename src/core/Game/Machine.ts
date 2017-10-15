import {
    IGameState,
} from './Header';
import {
    EntityCode,
} from '../Entity/Header';
import { IPlayerResponse } from '../Player/Header';
import {
    IEffectRegister, IMutatorRegister, IEffectFilterRegister,
    IEffectPack,
} from '../Event/Header';
import { ApplyEffect } from '../Event/Effect';
import { CheckFilter } from '../Event/Filter';
import { ApplyMutator } from '../Event/Mutator';

import Interceptors from '../Zone/Zones/Interceptors';

export abstract class GameMachine {
    constructor(public state: IGameState,
        public effectRegister: IEffectRegister,
        public filterRegister: IEffectFilterRegister,
        public mutatorRegister: IMutatorRegister) { }

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
        let interceptors = Interceptors.Ordered(this.state).map(code => {
            return Interceptors.Get(code, this.state);
        });
        let mutated = interceptors.reduce((packs, intercept) => {
            let intercepted = packs.map(p => {
                // Remove nulled Effects before they reach the filter.
                // This is necessary as filters get unhappy with
                // non-expected null packs as those can cause a
                // cascade of problems if we allow them when not expected.
                if (p === null) return [];
                let matches = CheckFilter(this.filterRegister,
                    p, intercept.Filter, this.state);
                if (!matches) return [p];
                return ApplyMutator(this.mutatorRegister,
                    p, intercept.Mutator);
            });
            let flat = intercepted.reduce((total, parts) => {
                total.push(...parts);
                return total;
            }, []);
            return flat;
        }, [e]);

        mutated.forEach(m => {
            if (m === null) return;
            this.state = ApplyEffect(this.effectRegister, m, this.state,
                (player: EntityCode) => this.getPlayerResponse(player));
        });
    }

    public abstract getPlayerResponse(player: EntityCode): IPlayerResponse;
}
