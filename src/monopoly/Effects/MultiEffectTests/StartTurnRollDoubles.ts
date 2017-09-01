import * as T from '../../../core/test';
import { TestCase, ISuiteDescription, CloneGameState } from '../MultiEffect_test';
import { GetPreparedGameState, ForceDoubles } from '../../helpers_test';
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
 * StartTurn, roll doubles, move, take next turn.
 */
(() => {

    // Need a non-generic prepared state to work off of
    // to enforce the first rng action is to roll doubles.
    let baseState = ForceDoubles(GetPreparedGameState(false));

    // This determines who will have the turn that owns the move.
    let activePlayerIdentity = T.PlayerTwoEntityCode;

    let g = CloneGameState(baseState);
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
    // amount which the player should move in both the first
    // roll, which should be doubles, and the second roll.
    let stateClone = CloneGameState(baseState);
    let firstRolls = [0, 0];
    let secondRolls = [0, 0];
    getRNGContext(stateClone, (rng) => {
        firstRolls = firstRolls.map(() => rng.nextInt(1, 6));
        secondRolls = secondRolls.map(() => rng.nextInt(1, 6));
    });
    let firstSum = firstRolls.reduce((a, b) => a + b);
    let secondSum = secondRolls.reduce((a, b) => a + b);

    let postStartExpected = [
        NewStartTurnEvent(activePlayerIdentity),
        NewPlayerPriorityEvent(activePlayerIdentity),
        NewMoveEvent(activePlayerIdentity, firstRolls),
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
    ]);

    let afterFirstMove = new Map();
    afterFirstMove.set(
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
                firstSum,
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
            entityPathHas: afterFirstMove,
            // Ensure we aren't blowing the stack
            StackHeight: 2,
        },
        registeredEffects,
    ]);

    cases.push([
        CloneGameState(g),
        null,
        null,
        3,
        'PlayerPriority fires - active player passes',
        {
            currentTurn: activePlayerIdentity,
            entityPathHas: afterFirstMove,
            StackHeight: 1,
        },
        registeredEffects,
    ]);

    let postStartSecondExpected = [
        NewEndTurnEvent(activePlayerIdentity),
        NewPlayerPriorityEvent(activePlayerIdentity),
        NewMoveEvent(activePlayerIdentity, secondRolls),
    ];

    cases.push([
        CloneGameState(g),
        null,
        null,
        4,
        'StartTurn fires again',
        {
            currentTurn: activePlayerIdentity,
            entityPathHas: afterFirstMove, // Unchanged till move
            stackHas: postStartSecondExpected,
            StackHeight: 3,
        },
        registeredEffects,
    ]);

    let afterSecondMove = new Map();
    afterSecondMove.set(
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
                firstSum + secondSum,
            ],
        ]),
    );

    cases.push([
        CloneGameState(g),
        null,
        null,
        5,
        'Move fires again',
        {
            currentTurn: activePlayerIdentity,
            entityPathHas: afterSecondMove, // Unchanged till move
            StackHeight: 2,
        },
        registeredEffects,
    ]);

    cases.push([
        CloneGameState(g),
        null,
        null,
        6,
        'PlayerPriority fires again - active player passes',
        {
            currentTurn: activePlayerIdentity,
            entityPathHas: afterSecondMove,
            StackHeight: 1, // StartTurn left on stack
        },
        registeredEffects,
    ]);

})();

export const Self = 'StartTurnRollDoubles';

export const Desc = {
    Cases: cases,
    Self,
} as ISuiteDescription;

export default Desc;
