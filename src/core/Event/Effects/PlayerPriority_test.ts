import { TestCase } from '../SingleEffect_test';
import {
    GameState,
} from '../../Game/Game';
import * as T from '../../test';
import { GlobalStateEntityCode} from '../../Entity/Header';
import Global from '../../Zone/Zones/Global';
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
            TargetType: Global.TargetTypes.Global,
            Effect: PlayerPriority.Self,
        },
        'PlayerPriority pass with empty state',
        {
            currentTurn: T.PlayerOneEntityCode,
            StackHeight: 0,
        },
        undefined, // This is a core Effect, its already defined.
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
            TargetType: Global.TargetTypes.Global,
            Effect: PlayerPriority.Self,
        },
        'PlayerPriority pass with non-empty state',
        {
            currentTurn: T.PlayerOneEntityCode,
            stackHas: expected,
            StackHeight: 1,
        },
        undefined, // This is a core Effect, its already defined.
    ]);
})();

export default cases;
