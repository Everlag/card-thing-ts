import { TestCase } from '../SingleEffect_test';
import {
    GameState,
} from '../../Game/Game';
import * as T from '../../test';
import { GlobalStateEntityCode} from '../../Entity/Header';
import Global from '../../Zone/Zones/Global';
import {
    NewEndTurnEvent, NewPlayerPriorityEvent,
} from './../Event';
import StartTurn from './StartTurn';

let cases: Array<TestCase> = [];

(() => {
    let expected = [
        NewEndTurnEvent(T.PlayerOneEntityCode),
        NewPlayerPriorityEvent(T.PlayerOneEntityCode),
        NewPlayerPriorityEvent(T.PlayerTwoEntityCode),
    ];

    cases.push([
        new GameState(T.DefaultPlayers),
        {
            Source: GlobalStateEntityCode,
            Targets: [T.PlayerOneEntityCode],
            TargetType: Global.TargetTypes.Global,
            Effect: StartTurn.Self,
        },
        'StartTurn empty state',
        {
            currentTurn: T.PlayerOneEntityCode,
            stackHas: expected,
        },
    ]);
})();

export default cases;
