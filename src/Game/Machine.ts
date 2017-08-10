import {
    IGameState,
} from './Header';
import {
    EntityCode,
} from '../Entity/Header';
import { IPlayerResponse } from '../Player/Header';
import { ApplyEffect } from '../Event/Effect';

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
            this.state = ApplyEffect(e, this.state, (player: EntityCode) => {
                return this.getPlayerResponse(player);
            });
        });
    }

    public abstract getPlayerResponse(player: EntityCode): IPlayerResponse;
}
