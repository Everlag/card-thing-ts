import { GameState } from '../../Game/Game';
import * as T from '../../test';
import { TestCase, CloneGameState } from '../MultiEffect_test';
import {
    NewEndTurnEvent, NewStartTurnEvent,
    NewPlayerPriorityEvent, NewSetInterceptEvent, NewRemoveInterceptEvent,
    NewThrowGuardEvent,
} from './../Event';

import ThrowGuard from './../Effects/ThrowGuard';
import Cancel from './../Mutators/Cancel';

let cases: Array<TestCase> = [];

/**
 * Register an interceptor to cancel a ThrowGuard Event.
 * Validate that the ThrowGuard Effect is cancelled when it is detected.
 * Remove the interceptor.
 */
(() => {
    let g = new GameState(T.GetDefaultPlayersWithMods(T.AlwaysQuery));
    let guardCanceller = NewSetInterceptEvent(T.ExternalEntityCode,
        {
            Effect: ThrowGuard.Self,
        },
        {
            Mutator: Cancel.Self,
        });

    g.stack.push(...[
        NewThrowGuardEvent(),
        guardCanceller,
    ]);

    cases.push([
        CloneGameState(g),
        null,
        null,
        2,
        'Establish interceptor - catches guard',
        {
            StackHeight: 0,
            interceptCount: 1,
        },
    ]);
})();

export default cases;
