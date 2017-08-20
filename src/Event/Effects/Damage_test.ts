import { TestCase } from '../SingleEffect_test';
import {
    GameState,
} from '../../Game/Game';
import * as T from '../../test';
import Damage from './Damage';
import Players from '../../Zone/Zones/Players';

let cases: Array<TestCase> = [];

(() => {
    let expected = new Map();
    expected.set(
        Players.Self,
        new Map([[
            `${T.PlayerTwoEntityCode}.Health`,
            1,
        ]]),
    );

    cases.push([
        new GameState(T.GetDefaultPlayers()),
        {
            Source: T.PlayerOneEntityCode,
            Targets: [T.PlayerTwoEntityCode],
            TargetType: Players.TargetTypes.Player,
            Effect: Damage.Self,

            // Ensure their health is reduced to exactly 1
            Damage: T.PlayerDefaultHealth - 1,
        },
        'Damage decrement target player health to exactly 1',
        {
            StackHeight: 0,
            zonePathHas: expected,
        },
    ]);
})();

(() => {
    let expected = new Map();
    expected.set(
        Players.Self,
        new Map([[
            `${T.PlayerTwoEntityCode}.Health`,
            T.PlayerDefaultHealth,
        ]]),
    );

    cases.push([
        new GameState(T.GetDefaultPlayers()),
        {
            Source: T.PlayerOneEntityCode,
            Targets: [T.PlayerTwoEntityCode],
            TargetType: Players.TargetTypes.Player,
            Effect: Damage.Self,

            Damage: 0,
        },
        'Damage of zero does nothing',
        {
            StackHeight: 0,
            zonePathHas: expected,
        },
    ]);
})();

export default cases;
