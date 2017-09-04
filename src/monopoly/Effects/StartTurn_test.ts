import { TestCase } from './SingleEffect_test';
import {
    getRNGContext,
} from '../../core/Game/Game';
import * as T from '../../core/test';
import { GlobalStateEntityCode} from '../../core/Entity/Header';
import {
    NewEndTurnEvent, NewPlayerPriorityEvent,
} from '../../core/Event/Event';

import { GetPreparedGameState, ForceDoubles } from '../helpers_test';

import Players from '../../core/Zone/Zones/Players';

import { NewMoveEvent } from './Move';
import StartTurn,
    { NewStartTurnEvent, RollsAllSame } from './StartTurn';

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
            TargetType: Players.TargetTypes.Player,
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

(() => {
    let state = ForceDoubles(GetPreparedGameState());
    // We need to force the rolls result to be doubles
    let rolls = [0, 1]; // Initial values will be overwritten
    getRNGContext(state, (rng) => {
        rolls = rolls.map(() => rng.nextInt(1, 6));
    });
    if (!RollsAllSame(rolls)) throw Error('failed to find rolls all same when expected');

    let expected = [
        NewStartTurnEvent(T.PlayerOneEntityCode),
        NewPlayerPriorityEvent(T.PlayerOneEntityCode),
        NewMoveEvent(T.PlayerOneEntityCode, rolls),
    ];

    cases.push([
        ForceDoubles(GetPreparedGameState()),
        {
            Source: GlobalStateEntityCode,
            Targets: [T.PlayerOneEntityCode],
            TargetType: Players.TargetTypes.Player,
            Effect: StartTurn.Self,
        },
        'StartTurn empty state - rolling doubles causes another StartTurn',
        {
            currentTurn: T.PlayerOneEntityCode,
            stackHas: expected,
            StackHeight: expected.length, // Exact, not subset
        },
        StartTurn, // We're overriding a core Effect!
    ]);
})();

export default cases;
