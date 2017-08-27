import { TestCase } from './SingleEffect_test';
import {
    getRNGContext,
} from '../../core/Game/Game';
import * as T from '../../core/test';
import { GlobalStateEntityCode} from '../../core/Entity/Header';
import Global from '../../core/Zone/Zones/Global';
import {
    NewEndTurnEvent, NewPlayerPriorityEvent,
} from '../../core/Event/Event';

import { GetPreparedGameState } from '../helpers_test';

import { NewMoveEvent } from './Move';
import StartTurn from './StartTurn';

let cases: Array<TestCase> = [];

(() => {
    let state = GetPreparedGameState();
    // We need to fetch the rolls result.
    let rolls = [0, 0];
    getRNGContext(state, (rng) => {
        rolls = rolls.map(() => rng.nextInt(1, 6));
    });

    let expected = [
        NewEndTurnEvent(T.PlayerOneEntityCode),
        NewPlayerPriorityEvent(T.PlayerOneEntityCode),
        NewMoveEvent(T.PlayerOneEntityCode, rolls),
    ];

    cases.push([
        GetPreparedGameState(),
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
        StartTurn, // We're overriding a core Effect!
    ]);
})();

export default cases;
