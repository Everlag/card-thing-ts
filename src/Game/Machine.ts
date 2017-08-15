import {
    IGameState,
} from './Header';
import {
    EntityCode,
} from '../Entity/Header';
import { IPlayerResponse } from '../Player/Header';
import { ApplyEffect } from '../Event/Effect';
import { CheckFilter } from '../Event/Filter';
import { ApplyMutator } from '../Event/Mutator';

export abstract class GameMachine {
    constructor(public state: IGameState) { }

    // tick runs the game for one discrete step.
    //
    // That means, we execute exactly the top-most event from
    // the stack.
    public tick() {
        let event = this.state.stack.pop();
        if (event === null) throw Error('cannot tick with popped null event');

        // Execute the effects from top down
        event.Effects.forEach(e => {
            // Pass each effect through the interceptors and
            // mutate on each match.
            let mutated = this.state.interceptors
                .reduce((pack, intercept) => {
                    if (!CheckFilter(pack, intercept.Filter)) return pack;
                    return ApplyMutator(pack, intercept.Mutator);
                }, e);
            // Skip effects which were cancelled during mutation.
            if (mutated === null) return;
            this.state = ApplyEffect(mutated, this.state,
                (player: EntityCode) => {
                    return this.getPlayerResponse(player);
                });
        });
    }

    public abstract getPlayerResponse(player: EntityCode): IPlayerResponse;
}
