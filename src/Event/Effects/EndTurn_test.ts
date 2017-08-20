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
import EndTurn from './EndTurn';

let cases: Array<TestCase> = [];

(() => {
    let expected = [
        NewStartTurnEvent(T.PlayerTwoEntityCode),
    ];

    cases.push([
        new GameState(T.DefaultPlayers),
        {
            Source: GlobalStateEntityCode,
            Targets: [T.PlayerOneEntityCode],
            TargetType: Global.TargetTypes.Global,
            Effect: EndTurn.Self,
        },
        'EndTurn empty state',
        {
            currentTurn: T.PlayerOneEntityCode,
            stackHas: expected,
        },
    ]);
})();

export default cases;
