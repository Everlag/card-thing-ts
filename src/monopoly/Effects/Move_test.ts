import { TestCase } from './SingleEffect_test';
import * as T from '../../core/test';
import { GetPreparedGameState } from '../helpers_test';
import { GlobalStateEntityCode} from '../../core/Entity/Header';
import Players from '../../core/Zone/Zones/Players';

import Tiles from '../Zones/Tiles';
import { WithPosition } from '../Entities/WithPosition';
import Move, { IMoveEffectPack, PassingGoPayout } from './Move';
import { NewPayEntityEvent } from './Pay';

let cases: Array<TestCase> = [];

(() => {
    let expected = new Map();
    expected.set(
        T.PlayerOneEntityCode,
        new Map<any, any>([
            [
                'Identity',
                T.PlayerOneEntityCode,
            ],
            [
                'Zone',
                Players.Self,
            ],
            [
                'Position',
                0,
            ],
        ]),
    );

    cases.push([
        GetPreparedGameState(),
        {
            Source: GlobalStateEntityCode,
            Targets: [T.PlayerOneEntityCode],
            TargetType: Players.TargetTypes.Player,
            Effect: Move.Self,

            Rolls: [0, 0],
        } as IMoveEffectPack,
        `${Move.Self} changes nothing with 0 rolls`,
        {
            currentTurn: T.PlayerOneEntityCode,
            entityPathHas: expected,
            StackHeight: 0,
        },
        Move,
    ]);
})();

(() => {
    let expected = new Map();
    expected.set(
        T.PlayerOneEntityCode,
        new Map<any, any>([
            [
                'Identity',
                T.PlayerOneEntityCode,
            ],
            [
                'Zone',
                Players.Self,
            ],
            [
                'Position',
                5,
            ],
        ]),
    );

    cases.push([
        GetPreparedGameState(),
        {
            Source: GlobalStateEntityCode,
            Targets: [T.PlayerOneEntityCode],
            TargetType: Players.TargetTypes.Player,
            Effect: Move.Self,

            Rolls: [2, 3],
        } as IMoveEffectPack,
        `${Move.Self} adds small rolls`,
        {
            currentTurn: T.PlayerOneEntityCode,
            entityPathHas: expected,
            StackHeight: 0,
        },
        Move,
    ]);
})();

(() => {
    let knownState = GetPreparedGameState();
    let maxIndex = Tiles.Ordered(knownState).length - 1;

    let expected = new Map();
    expected.set(
        T.PlayerOneEntityCode,
        new Map<any, any>([
            [
                'Identity',
                T.PlayerOneEntityCode,
            ],
            [
                'Zone',
                Players.Self,
            ],
            [
                'Position',
                1,
            ],
        ]),
    );

    let expectedStack = [
        NewPayEntityEvent(
            GlobalStateEntityCode,
            T.PlayerOneEntityCode,
            PassingGoPayout,
        ),
    ];

    let state = GetPreparedGameState();
    let withPositon = WithPosition(Players.Get(T.PlayerOneEntityCode, state));
    withPositon.Position = maxIndex - 1; // Force it to wrap

    cases.push([
        state,
        {
            Source: GlobalStateEntityCode,
            Targets: [T.PlayerOneEntityCode],
            TargetType: Players.TargetTypes.Player,
            Effect: Move.Self,

            // It should wrap to exactly 1
            Rolls: [1, 1],
        } as IMoveEffectPack,
        `${Move.Self} wraps around tile boundary`,
        {
            currentTurn: T.PlayerOneEntityCode,
            entityPathHas: expected,
            stackHas: expectedStack,
            StackHeight: 1,
        },
        Move,
    ]);
})();

export default cases;
