import { GameState } from '../../Game/Game';
import * as T from '../../test';
import { TestCase, CloneGameState } from '../MultiEffect_test';
import {
    NewEndTurnEvent, NewStartTurnEvent,
    NewPlayerPriorityEvent, NewSetInterceptEvent,
} from './../Event';

import EndTurn from './../Effects/EndTurn';
import Redirect from './../Mutators/Redirect';

let cases: Array<TestCase> = [];

/**
 * Register an interceptor to cancel an Event.
 * Validate that the Event is cancelled when it is detected.
 * 
 * EXTENSION: INCLUDE IN OTHER TEST CASE - RENAME THIS CASE todo TOMORROW
 * Register an interceptor that deregisters another interceptor.
 * ie, Register an Interceptor that cancels Damage events going
 * to a specific player. Then, at the end of the turn, deregister
 * both interceptor using another interceptor that was established at the
 * same time as the first one.
 */
(() => {
    let priorExpected = [
        NewStartTurnEvent(T.PlayerTwoEntityCode),
    ];

    let g = new GameState(T.GetDefaultPlayersWithMods(T.AlwaysQuery));
    let EOT = NewSetInterceptEvent(T.PlayerOneEntityCode,
        {
            Effect: EndTurn.Self,
        },
        {
            Mutator: Redirect.Self,
        });
    
    g.stack.push(...[
        NewEndTurnEvent(T.PlayerOneEntityCode),
        NewPlayerPriorityEvent(T.PlayerTwoEntityCode),
        NewPlayerPriorityEvent(T.PlayerOneEntityCode),
    ]);

    cases.push([
        g,
        null,
        null,
        3,
        'Establish interceptor',
        {
            currentTurn: T.PlayerOneEntityCode,
            stackHas: priorExpected,
        },
    ]);
})();

export default cases;
