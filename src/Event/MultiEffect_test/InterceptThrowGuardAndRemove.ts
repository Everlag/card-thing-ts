import { GameState } from '../../Game/Game';
import * as T from '../../test';
import { TestCase, CloneGameState } from '../MultiEffect_test';
import {
    NewSetInterceptEvent, NewThrowGuardEvent, NewPlayerPriorityEvent,
} from './../Event';

import ThrowGuard from './../Effects/ThrowGuard';
import PlayerPriority from './../Effects/PlayerPriority';
import Cancel from './../Mutators/Cancel';

let cases: Array<TestCase> = [];

/**
 * Register an interceptor to cancel a ThrowGuard Event.
 * Validate that the ThrowGuard Effect is cancelled when it is detected.
 * Additionally, remove the interceptor on the next PlayerPriority Effect.
 */
(() => {
    let g = new GameState(T.GetDefaultPlayersWithMods(T.AlwaysQuery));
    let guardCanceller = NewSetInterceptEvent(T.ExternalEntityCode,
        {
            Effect: ThrowGuard.Self,
        },
        {
            Mutator: Cancel.Self,
        },
        {
            Effect: PlayerPriority.Self,
            Targets: [T.PlayerOneEntityCode],
        },
    );

    g.stack.push(...[
        // Triggers interceptor removal
        NewPlayerPriorityEvent(T.PlayerOneEntityCode),
        NewThrowGuardEvent(), // Removed by interceptor
        guardCanceller, // Introduces interceptor
    ]);

    cases.push([
        CloneGameState(g),
        null,
        null,
        2,
        'Establish interceptor - catches guard',
        {
            StackHeight: 1,
            // One for the desired interceptor and one for its Expiry
            interceptCount: 2,
        },
    ]);

    cases.push([
        CloneGameState(g),
        null,
        null,
        3,
        'Establish interceptor - removed on registered Expiry',
        {
            StackHeight: 0,
            interceptCount: 0,
        },
    ]);
})();

export default cases;
