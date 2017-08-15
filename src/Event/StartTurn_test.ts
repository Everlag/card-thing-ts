import { Cases } from './SingleEffect_test'
import {
    GameState,
} from '../Game/Game';
import * as T from '../test';
import { GlobalStateEntityCode} from '../Entity/Header';
import { Effect, TargetType } from './Header';
import {
    NewEndTurnEvent, NewPlayerPriorityEvent,
} from './Event';

(() => {
    let expected = [
        NewPlayerPriorityEvent(T.PlayerOneEntityCode),
        NewPlayerPriorityEvent(T.PlayerTwoEntityCode),
        NewEndTurnEvent(T.PlayerOneEntityCode),
    ];

    Cases.push([
        new GameState(T.DefaultPlayers),
        {
            Source: GlobalStateEntityCode,
            Targets: [T.PlayerOneEntityCode],
            TargetType: TargetType.Global,
            Effect: Effect.StartTurn,
        },
        'StartTurn empty state',
        {
            currentTurn: T.PlayerOneEntityCode,
            stackHas: expected,
        },
    ]);
})();