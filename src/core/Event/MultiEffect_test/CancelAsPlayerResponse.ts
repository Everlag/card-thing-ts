import { GameState } from '../../Game/Game';
import * as T from '../../test';
import { TestCase, ISuiteDescription, CloneGameState } from '../MultiEffect_test';
import {
    NewPlayerPriorityEvent, NewEndTurnEvent,
    NewThrowGuardEvent,  NewSetInterceptEvent,
} from './../Event';
import { PlayerAction, IPlayerResponse } from '../../Player/Header';

import { IEffectPackFilter } from '../Header';
import Interceptors from './../../Zone/Zones/Interceptors';
import ThrowGuard from '../Effects/ThrowGuard';

import Cancel from '../Mutators/Cancel';

let cases: Array<TestCase> = [];

/**
 * Intent is to ensure that the player can correctly respond.
 *
 * Put ThrowGuard on stack.
 * Player1 response is to SetIntercept which will cancel the ThrowGuard
 * as well as itself.
 * Validate that ThrowGuard was removed and we can pass the turn.
 */
(() => {
    let g = new GameState(T.GetDefaultPlayersWithMods(T.AlwaysQuery));

    let cancellerFilter = {
        Effect: ThrowGuard.Self,
    } as IEffectPackFilter;
    let canceller = NewSetInterceptEvent(T.ExternalEntityCode,
        cancellerFilter,
        {
            Mutator: Cancel.Self,
        },
        cancellerFilter, // Expire after single use
    );

    let playerPass = {
        Effects: [],
        Action: PlayerAction.Pass,
    } as IPlayerResponse;

    let player1Responses = [
        playerPass,
        canceller,
    ];

    g.stack.push(...[
        // Pass turn
        NewEndTurnEvent(T.PlayerOneEntityCode),
        // To be intercepted
        NewThrowGuardEvent(),
        // Will register canceller to be executed
        NewPlayerPriorityEvent(T.PlayerOneEntityCode),
    ]);

    cases.push([
        CloneGameState(g),
        player1Responses,
        null,
        1,
        'Respond to priority with SetIntercept event',
        {
            StackHeight: 5,
            currentTurn: T.PlayerOneEntityCode,
            // Event yet to fire
            zoneCount: T.NewExpectedCount(Interceptors.Self, 0),
        },
        undefined, // This is a core Effect, its already defined.
        undefined,
    ]);

    cases.push([
        CloneGameState(g),
        player1Responses,
        null,
        3,
        'Both players pass priority priority',
        {
            StackHeight: 3,
            currentTurn: T.PlayerOneEntityCode,
            // None yet
            zoneCount: T.NewExpectedCount(Interceptors.Self, 0),
        },
        undefined, // This is a core Effect, its already defined.
        undefined,
    ]);

    cases.push([
        CloneGameState(g),
        player1Responses,
        null,
        4,
        'Interceptor registered',
        {
            StackHeight: 2,
            currentTurn: T.PlayerOneEntityCode,
            // One for the canceller and one for the simultaneous expiry
            zoneCount: T.NewExpectedCount(Interceptors.Self, 2),
        },
        undefined, // This is a core Effect, its already defined.
        undefined,
    ]);

    cases.push([
        CloneGameState(g),
        player1Responses,
        null,
        5,
        'ThrowGuard is cancelled, interceptor expire',
        {
            StackHeight: 1,
            currentTurn: T.PlayerOneEntityCode,
        },
        undefined, // This is a core Effect, its already defined.
        undefined,
    ]);

    cases.push([
        CloneGameState(g),
        player1Responses,
        null,
        7,
        'EndTurn fires, StartTurn also fires',
        {
            StackHeight: 3,
            currentTurn: T.PlayerTwoEntityCode,
        },
        undefined, // This is a core Effect, its already defined.
        undefined,
    ]);

})();

export const Self = 'CancelAsPlayerResponse';

export const Desc = {
    Cases: cases,
    Self,
} as ISuiteDescription;

export default Desc;
