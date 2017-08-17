import { GameState } from '../../Game/Game';
import * as T from '../../test';
import { TestCase, CloneGameState } from '../MultiEffect_test';
import {
    NewSetInterceptEvent, NewEndTurnEvent,
} from './../Event';
import StartTurn from './../Effects/StartTurn';
import Redirect,
    {
        IRedirectMutator, RedirectMutatorDirection,
    } from './../Mutators/Redirect';

let cases: Array<TestCase> = [];

/**
 * Intent of this test is to ensure we can skip a player's turn
 * exactly once using the SetIntercept with Expiry
 *
 * Register an interceptor to cancel a StartTurn Event.
 * Validate that we skipped
 * Additionally, remove the interceptor on the next PlayerPriority Effect.
 */
(() => {
    let g = new GameState(T.GetDefaultPlayersWithMods(T.AlwaysQuery));

    // Enforce exactly-once semantics by having the same filter
    // to activiate the mutatator as we do to expire.
    let redirectorFilter = {
        Effect: StartTurn.Self,
    };
    let guardCanceller = NewSetInterceptEvent(T.ExternalEntityCode,
        redirectorFilter,
        {
            Mutator: Redirect.Self,
            Direction: RedirectMutatorDirection.ToOthers,
            Others: [T.PlayerOneEntityCode],

        } as IRedirectMutator,
        redirectorFilter,
    );

    g.stack.push(...[
        NewEndTurnEvent(T.PlayerOneEntityCode), // Proc interceptor
        guardCanceller, // Introduces interceptor
    ]);

    cases.push([
        CloneGameState(g),
        null,
        null,
        2,
        'Pass turn, redirects - before StartTurn executed',
        {
            StackHeight: 1,
            currentTurn: T.PlayerOneEntityCode,
            // One for the desired interceptor and one for its Expiry
            interceptCount: 2,
        },
    ]);

    cases.push([
        CloneGameState(g),
        null,
        null,
        3,
        'Pass turn, redirects - after StartTurn executed',
        {
            StackHeight: 3,
            currentTurn: T.PlayerOneEntityCode,
            interceptCount: 0,
        },
    ]);

    cases.push([
        CloneGameState(g),
        null,
        null,
        7,
        'Pass turn, redirects - after extra turn, passes correctly',
        {
            StackHeight: 3, // Normal, post StartTurn height
            currentTurn: T.PlayerTwoEntityCode,
            interceptCount: 0, // Explicitly none
        },
    ]);
})();

export default cases;
