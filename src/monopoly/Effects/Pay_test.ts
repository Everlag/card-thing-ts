import { TestCase } from './SingleEffect_test';
import * as T from '../../core/test';

import {
    GlobalStateEntityCode,
} from '../../core/Entity/Header';
import { GetPreparedGameState } from '../helpers_test';

import Players from '../../core/Zone/Zones/Players';

import { WithMoney } from '../Entities/WithMoney';

import Pay, { NewPayEntityEvent } from './Pay';

let cases: Array<TestCase> = [];

(() => {
    let state = GetPreparedGameState();

    let baseMoney = 10;
    let event = NewPayEntityEvent(T.PlayerOneEntityCode, GlobalStateEntityCode,
        baseMoney - 1);
    if (event.Effects.length < 1) throw Error(`NewPayEntityEvent gave 0 effects`);

    let player = Players.Get(T.PlayerOneEntityCode, state);
    WithMoney(player).Money = baseMoney;

    let expected = new Map();
    expected.set(
        T.PlayerOneEntityCode,
        new Map<any, any>([
            [
                'Zone',
                Players.Self,
            ],
            [
                'Money',
                1,
            ],
        ]),
    );

    cases.push([
        state,
        event.Effects[0],
        'Pay - global target',
        {
            entityPathHas: expected,
        },
        Pay,
    ]);
})();

(() => {
    let state = GetPreparedGameState();

    let baseMoney = 10;
    let delta = baseMoney - 1;
    let event = NewPayEntityEvent(T.PlayerOneEntityCode,
        T.PlayerTwoEntityCode,
        delta);
    if (event.Effects.length < 1) throw Error(`NewPayEntityEvent gave 0 effects`);

    let player1 = Players.Get(T.PlayerOneEntityCode, state);
    WithMoney(player1).Money = baseMoney;

    let player2 = Players.Get(T.PlayerTwoEntityCode, state);
    WithMoney(player2).Money = 2; // Explicit non-zero to ensure added

    let expected = new Map();
    expected.set(
        T.PlayerOneEntityCode,
        new Map<any, any>([
            [
                'Zone',
                Players.Self,
            ],
            [
                'Money',
                1,
            ],
        ]),
    );

    expected.set(
        T.PlayerTwoEntityCode,
        new Map<any, any>([
            [
                'Zone',
                Players.Self,
            ],
            [
                'Money',
                2 + delta,
            ],
        ]),
    );

    cases.push([
        state,
        event.Effects[0],
        'Pay - other player target',
        {
            entityPathHas: expected,
        },
        Pay,
    ]);
})();

(() => {
    let state = GetPreparedGameState();

    let baseMoney = 10;
    let delta = 2;
    let event = NewPayEntityEvent(GlobalStateEntityCode,
        T.PlayerOneEntityCode,
        delta);
    if (event.Effects.length < 1) throw Error(`NewPayEntityEvent gave 0 effects`);

    let player = Players.Get(T.PlayerOneEntityCode, state);
    WithMoney(player).Money = baseMoney;

    let expected = new Map();
    expected.set(
        T.PlayerOneEntityCode,
        new Map<any, any>([
            [
                'Zone',
                Players.Self,
            ],
            [
                'Money',
                baseMoney + delta,
            ],
        ]),
    );

    cases.push([
        state,
        event.Effects[0],
        'Pay - global paying Player',
        {
            entityPathHas: expected,
        },
        Pay,
    ]);
})();

export default cases;
