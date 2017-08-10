import { GameState } from '../Game/Game';
import * as T from '../test';
import { IFilterState, FilterMatches } from '../IFilterState';
import {
    GlobalStateEntityCode,
} from '../Entity/Header';
import { ApplyEffect } from './Effect';
import {
    Effect, IEffectPack, TargetType,
} from './Header';
import {
    NewEndTurnEvent, NewStartTurnEvent, NewPlayerPriorityEvent,
} from './Event';

type TestCase = [GameState, IEffectPack, String, IFilterState];

let cases = new Array<TestCase>();

(() => {
    let expected = [
        NewPlayerPriorityEvent(T.PlayerOneEntityCode),
        NewPlayerPriorityEvent(T.PlayerTwoEntityCode),
        NewEndTurnEvent(T.PlayerOneEntityCode),
    ];

    cases.push([
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

(() => {
    let expected = [
        NewStartTurnEvent(T.PlayerTwoEntityCode),
    ];

    cases.push([
        new GameState(T.DefaultPlayers),
        {
            Source: GlobalStateEntityCode,
            Targets: [T.PlayerOneEntityCode],
            TargetType: TargetType.Global,
            Effect: Effect.EndTurn,
        },
        'EndTurn empty state',
        {
            currentTurn: T.PlayerOneEntityCode,
            stackHas: expected,
        },
    ]);
})();

(() => {
    cases.push([
        new GameState(T.DefaultPlayers),
        {
            Source: GlobalStateEntityCode,
            Targets: [T.PlayerOneEntityCode],
            TargetType: TargetType.Global,
            Effect: Effect.PlayerPriority,
        },
        'PlayerPriority pass with empty state',
        {
            currentTurn: T.PlayerOneEntityCode,
            StackHeight: 0,
        },
    ]);
})();

(() => {
    let g = new GameState(T.DefaultPlayers);

    let expected = [
        NewStartTurnEvent(T.PlayerTwoEntityCode),
    ];
    g.stack.push(...expected);

    cases.push([
        g,
        {
            Source: GlobalStateEntityCode,
            Targets: [T.PlayerOneEntityCode],
            TargetType: TargetType.Global,
            Effect: Effect.PlayerPriority,
        },
        'PlayerPriority pass with non-empty state',
        {
            currentTurn: T.PlayerOneEntityCode,
            stackHas: expected,
            StackHeight: 1,
        },
    ]);
})();

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
            Effect: Effect.Damage,

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
            Effect: Effect.Damage,

            // Ensure their health is reduced to exactly 1
            Damage: 0,
        },
        'Damage of zero does nothing',
        {
            StackHeight: 0,
            playerHas: expected,
        },
    ]);
})();

class SingleEffectTest extends T.Test {
    constructor(private testCase: TestCase) {
        super();
    }

    public Run() {
        let [state, effect, name, matchingFilter] = this.testCase;

        state = ApplyEffect(effect, state, () => {
            throw Error('player choice was accessed');
        });

        let match = FilterMatches(state, matchingFilter);
        if (match === null) return;

        let msg = `state did not match filter
                case - ${name}
                ${match}`;

        throw Error(msg);
    }
}

// Sanity check our cases before we package them up
(() => {
    let caseNames = cases.map(c => c[2]);
    let nameSet = new Set<String>(caseNames);
    if (nameSet.size !== caseNames.length) {
        throw Error('duplicated case name in IFilterState');
    }
})();

const tests = cases.map(c => new SingleEffectTest(c));
export default tests;
