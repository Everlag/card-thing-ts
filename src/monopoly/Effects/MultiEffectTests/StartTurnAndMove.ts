import * as T from '../../../core/test';
import { TestCase, ISuiteDescription, CloneGameState } from '../MultiEffect_test';
import { GetPreparedGameState } from '../../helpers_test';
import { getRNGContext } from '../../../core/Game/Game';
import {
    NewEndTurnEvent, NewPlayerPriorityEvent,
} from '../../../core/Event/Event';

import Players from '../../../core/Zone/Zones/Players';

import StartTurn, { NewStartTurnEvent } from '../../Effects/StartTurn';
import Move, { NewMoveEvent } from '../../Effects/Move';

let cases: Array<TestCase> = [];

const registeredEffects = [StartTurn, Move];

/**
 * StartTurn, roll, and move.
 */
(() => {
    // This determines who will have the turn that owns the move.
    let activePlayerIdentity = T.PlayerTwoEntityCode;

    let g = GetPreparedGameState(false);
    g.stack.push(...[
        NewStartTurnEvent(activePlayerIdentity),
    ]);

    let beforeMove = new Map();
    beforeMove.set(
        activePlayerIdentity,
        new Map<any, any>([
            [
                'Identity',
                activePlayerIdentity,
            ],
            [
                'Zone',
                Players.Self,
            ],
            [
                'Position',
                0,
            ],
        ]),
    );

    // We need to pre-compute the rolls to determine the
    // amount which the player should move.
    //
    // TODO: consider a way to make this less flaky
    //       as more complex interactions in the future could
    //       cause issues, such as rolling doubles.
    let stateClone = GetPreparedGameState(false);
    let rolls = [0, 0];
    getRNGContext(stateClone, (rng) => {
        rolls = rolls.map(() => rng.nextInt(1, 6));
    });
    let sum = rolls.reduce((a, b) => a + b);

    let postStartExpected = [
        NewEndTurnEvent(activePlayerIdentity),
        NewPlayerPriorityEvent(activePlayerIdentity),
        NewMoveEvent(activePlayerIdentity, rolls),
    ];

    cases.push([
        CloneGameState(g),
        null,
        null,
        1,
        'StartTurn fires - Second Player turn begins',
        {
            currentTurn: activePlayerIdentity,
            entityPathHas: beforeMove,
            // Establish strong stack constraint
            stackHas: postStartExpected,
        },
        registeredEffects,
        undefined,
    ]);

    let afterMove = new Map();
    afterMove.set(
        activePlayerIdentity,
        new Map<any, any>([
            [
                'Identity',
                activePlayerIdentity,
            ],
            [
                'Zone',
                Players.Self,
            ],
            [
                'Position',
                sum,
            ],
        ]),
    );

    cases.push([
        CloneGameState(g),
        null,
        null,
        2,
        'Move fires - active player moves',
        {
            currentTurn: activePlayerIdentity,
            entityPathHas: afterMove,
            // Ensure we aren't blowing the stack
            StackHeight: 2,
        },
        registeredEffects,
        undefined,
    ]);

    cases.push([
        CloneGameState(g),
        null,
        null,
        3,
        'PlayerPriority fires - active player passes',
        {
            currentTurn: activePlayerIdentity,
            entityPathHas: afterMove,
            StackHeight: 1,
        },
        registeredEffects,
        undefined,
    ]);

})();

export const Self = 'StartTurnAndMove';

export const Desc = {
    Cases: cases,
    Self,
} as ISuiteDescription;

export default Desc;
