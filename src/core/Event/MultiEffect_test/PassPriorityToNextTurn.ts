import { GameState } from '../../Game/Game';
import * as T from '../../test';
import { TestCase, ISuiteDescription, CloneGameState } from '../MultiEffect_test';
import {
    NewEndTurnEvent, NewStartTurnEvent, NewPlayerPriorityEvent,
} from './../Event';

let cases: Array<TestCase> = [];

/**
 * Pass through an entire turn.
 */
(() => {
    let priorExpected = [
        NewStartTurnEvent(T.PlayerTwoEntityCode),
    ];

    let g = new GameState(T.GetDefaultPlayersWithMods(T.AlwaysQuery));
    g.stack.push(...[
        NewEndTurnEvent(T.PlayerOneEntityCode),
        NewPlayerPriorityEvent(T.PlayerTwoEntityCode),
        NewPlayerPriorityEvent(T.PlayerOneEntityCode),
    ]);

    cases.push([
        CloneGameState(g),
        null,
        null,
        3,
        'Pass priority to next turn - prior to StartTurn',
        {
            currentTurn: T.PlayerOneEntityCode,
            stackHas: priorExpected,
        },
        undefined, // This is a core Effect, its already defined.
        undefined,
    ]);

    let afterExpected = [
        NewEndTurnEvent(T.PlayerTwoEntityCode),
        NewPlayerPriorityEvent(T.PlayerOneEntityCode),
        NewPlayerPriorityEvent(T.PlayerTwoEntityCode),
    ];

    cases.push([
        CloneGameState(g),
        null,
        null,
        4,
        'Pass priority to next turn  - after StartTurn',
        {
            currentTurn: T.PlayerTwoEntityCode,
            StackHeight: 3,
            stackHas: afterExpected,
        },
        undefined, // This is a core Effect, its already defined.
        undefined,
    ]);

    cases.push([
        CloneGameState(g),
        null,
        null,
        8,
        'Pass priority to turn after next turn  - after StartTurn',
        {
            currentTurn: T.PlayerOneEntityCode,
            StackHeight: 3,
        },
        undefined, // This is a core Effect, its already defined.
        undefined,
    ]);
})();

export const Self = 'PassPriorityToNextTurn';

export const Desc = {
    Cases: cases,
    Self,
} as ISuiteDescription;

export default Desc;
