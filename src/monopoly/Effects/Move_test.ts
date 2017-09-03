import { TestCase } from './SingleEffect_test';
import * as T from '../../core/test';
import { GetPreparedGameState } from '../helpers_test';
import { GlobalStateEntityCode} from '../../core/Entity/Header';
import Players from '../../core/Zone/Zones/Players';

import Tiles from '../Zones/Tiles';
import { WithPosition } from '../Entities/WithPosition';
import { HasRent, WithRent } from '../Entities/WithRent';
import { HasOwner, WithOwner } from '../Entities/WithOwner';
import Move, { IMoveEffectPack } from './Move';
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
            StackHeight: 0,
        },
        Move,
    ]);
})();

(() => {
    let state = GetPreparedGameState();

    // Find tile and position we can use
    let firstUsableTile = Tiles.Ordered(state).find(t => {
        let tile = Tiles.Get(t, state);
        return HasOwner(tile) && HasRent(tile);
    });
    if (firstUsableTile === undefined) {
        throw Error('could not find satisfactory tile for Move pays rent');
    }
    let tile = Tiles.Get(firstUsableTile, state);
    let tilePos = WithPosition(tile).Position;

    let rentToPay = WithRent(tile).BaseRent;

    // Enforce ownership
    WithOwner(tile).Owner = T.PlayerTwoEntityCode;

    let expectedStack = [
        NewPayEntityEvent(
            T.PlayerOneEntityCode,
            T.PlayerTwoEntityCode,
            rentToPay,
        ),
    ];

    cases.push([
        state,
        {
            Source: GlobalStateEntityCode,
            Targets: [T.PlayerOneEntityCode],
            TargetType: Players.TargetTypes.Player,
            Effect: Move.Self,

            Rolls: [tilePos - 1, 1],
        } as IMoveEffectPack,
        `${Move.Self} pays rent when necessary`,
        {
            currentTurn: T.PlayerOneEntityCode,
            stackHas: expectedStack,
            StackHeight: 1,
        },
        Move,
    ]);
})();

export default cases;
