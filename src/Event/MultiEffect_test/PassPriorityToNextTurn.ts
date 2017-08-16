import { GameState } from '../../Game/Game';
import { Phase } from '../../Game/Header';
import * as T from '../../test';
import { TestCase, CloneGameState } from '../MultiEffect_test';
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
        g,
        null,
        null,
        3,
        'Pass priority to next turn - prior to StartTurn',
        {
            currentTurn: T.PlayerOneEntityCode,
            stackHas: priorExpected,
            phase: Phase.StartOfTurn,
        },
    ]);

    let afterExpected = [
        NewPlayerPriorityEvent(T.PlayerOneEntityCode),
        NewPlayerPriorityEvent(T.PlayerTwoEntityCode),
        NewEndTurnEvent(T.PlayerTwoEntityCode),
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
    ]);
})();

export default cases;
