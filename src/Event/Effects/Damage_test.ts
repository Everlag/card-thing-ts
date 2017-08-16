import { TestCase } from '../SingleEffect_test';
import {
    GameState,
} from '../../Game/Game';
import * as T from '../../test';
import { TargetType } from './../Header';
import Damage from './Damage';

let cases: Array<TestCase> = [];

(() => {
    let expected = new Map();
    expected.set(
        T.PlayerTwoEntityCode,
        new Map([[
            'Self.Health',
            1,
        ]]),
    );

    cases.push([
        new GameState(T.GetDefaultPlayers()),
        {
            Source: T.PlayerOneEntityCode,
            Targets: [T.PlayerTwoEntityCode],
            TargetType: TargetType.Player,
            Effect: Damage.Self,

            // Ensure their health is reduced to exactly 1
            Damage: T.PlayerDefaultHealth - 1,
        },
        'Damage decrement target player health to exactly 1',
        {
            StackHeight: 0,
            playerHas: expected,
        },
    ]);
})();

(() => {
    let expected = new Map();
    expected.set(
        T.PlayerTwoEntityCode,
        new Map([[
            'Self.Health',
            T.PlayerDefaultHealth,
        ]]),
    );

    cases.push([
        new GameState(T.GetDefaultPlayers()),
        {
            Source: T.PlayerOneEntityCode,
            Targets: [T.PlayerTwoEntityCode],
            TargetType: TargetType.Player,
            Effect: Damage.Self,

            Damage: 0,
        },
        'Damage of zero does nothing',
        {
            StackHeight: 0,
            playerHas: expected,
        },
    ]);
})();

export default cases;
