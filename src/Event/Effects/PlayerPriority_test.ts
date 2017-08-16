import { TestCase } from '../SingleEffect_test';
import {
    GameState,
} from '../../Game/Game';
import * as T from '../../test';
import { GlobalStateEntityCode} from '../../Entity/Header';
import { TargetType } from './../Header';
import {
    NewStartTurnEvent,
} from './../Event';
import PlayerPriority from './PlayerPriority';

let cases: Array<TestCase> = [];

(() => {
    cases.push([
        new GameState(T.DefaultPlayers),
        {
            Source: GlobalStateEntityCode,
            Targets: [T.PlayerOneEntityCode],
            TargetType: TargetType.Global,
            Effect: PlayerPriority.Self,
        },
        'PlayerPriority pass with empty state',
        {
            currentTurn: T.PlayerOneEntityCode,
            StackHeight: 0,
        },
    ]);
})();

(() => {
    let g = new GameState(T.DefaultPlayers);

    let expected = [
        NewStartTurnEvent(T.PlayerTwoEntityCode),
    ];
    g.stack.push(...expected);

    cases.push([
        g,
        {
            Source: GlobalStateEntityCode,
            Targets: [T.PlayerOneEntityCode],
            TargetType: TargetType.Global,
            Effect: PlayerPriority.Self,
        },
        'PlayerPriority pass with non-empty state',
        {
            currentTurn: T.PlayerOneEntityCode,
            stackHas: expected,
            StackHeight: 1,
        },
    ]);
})();

export default cases;
