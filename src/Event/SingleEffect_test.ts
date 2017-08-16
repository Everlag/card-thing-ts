import {
    GameState, getRNGContext,
} from '../Game/Game';
import * as T from '../test';
import { IFilterState, FilterMatches } from '../IFilterState';
import {
    GlobalStateEntityCode,

    IAsInterceptor,
} from '../Entity/Header';
import { NewEntityCode } from '../Entity/EntityCode';
import { ApplyEffect } from './Effect';
import {
    Effect, IEffectPack, TargetType,

    ISetInterceptorEffectPack, IRemoveInterceptorEffectPack,
    EffectMutator,
} from './Header';
import {
    NewStartTurnEvent,
} from './Event';


export type TestCase = [GameState, IEffectPack, String, IFilterState];

export const Cases = new Array<TestCase>();

import StartTurn_test from './StartTurn_test';
Cases.push(...StartTurn_test);

(() => {
    let expected = [
        NewStartTurnEvent(T.PlayerTwoEntityCode),
    ];

    Cases.push([
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
    Cases.push([
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

    Cases.push([
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

    Cases.push([
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

    Cases.push([
        new GameState(T.GetDefaultPlayers()),
        {
            Source: T.PlayerOneEntityCode,
            Targets: [T.PlayerTwoEntityCode],
            TargetType: TargetType.Player,
            Effect: Effect.Damage,

            Damage: 0,
        },
        'Damage of zero does nothing',
        {
            StackHeight: 0,
            playerHas: expected,
        },
    ]);
})();

(() => {
    // We need to compute the EntityCode ahead of time.
    //
    // We rely on the default, static seed to ensure consistency
    // of results between GameState instances for RNG access.
    let state = new GameState(T.GetDefaultPlayers());
    let identity;
    getRNGContext(state, (rng) => {
        identity = NewEntityCode(rng);
    });
    if (identity === undefined) throw Error('failed to fetch EntityCode');

    let interceptor = {
        Identity: identity,
        IsInterceptor: true,
        Filter: {},
        Mutator: {
            Mutator: EffectMutator.Cancel,
        },
    } as IAsInterceptor;
    let expectedInterceptors = [interceptor];

    Cases.push([
        new GameState(T.GetDefaultPlayers()),
        {
            Source: T.PlayerOneEntityCode,
            Targets: [GlobalStateEntityCode],
            TargetType: TargetType.Global,
            Effect: Effect.SetIntercept,

            Filter: interceptor.Filter,
            Mutator: interceptor.Mutator,
        } as ISetInterceptorEffectPack,
        'SetInterceptor registers interceptor',
        {
            StackHeight: 0,
            interceptsHas: expectedInterceptors,
        },
    ]);
})();

(() => {
    // We construct ourselves an interceptor
    let state = new GameState(T.GetDefaultPlayers());
    let identityToRemove;
    getRNGContext(state, (rng) => {
        identityToRemove = NewEntityCode(rng);
    });
    if (identityToRemove === undefined) throw Error('failed to fetch EntityCode');

    let interceptor = {
        Identity: identityToRemove,
        IsInterceptor: true,
        Filter: {},
        Mutator: {
            Mutator: EffectMutator.Cancel,
        },
    } as IAsInterceptor;
    state.interceptors.push(interceptor);

    Cases.push([
        state,
        {
            Source: T.PlayerOneEntityCode,
            Targets: [identityToRemove],
            TargetType: TargetType.Interceptor,
            Effect: Effect.RemoveIntercept,

            MustMatch: 'all',
        } as IRemoveInterceptorEffectPack,
        'RemoveInterceptor removes interceptor - only interceptor',
        {
            StackHeight: 0,
            interceptCount: 0,
        },
    ]);
})();

(() => {
    // We construct ourselves an interceptor
    let state = new GameState(T.GetDefaultPlayers());
    let identityToRemove;
    getRNGContext(state, (rng) => {
        identityToRemove = NewEntityCode(rng);
    });
    if (identityToRemove === undefined) throw Error('failed to fetch EntityCode');

    let interceptor = {
        Identity: identityToRemove,
        IsInterceptor: true,
        Filter: {},
        Mutator: {
            Mutator: EffectMutator.Cancel,
        },
    } as IAsInterceptor;
    let fluff = {
        Identity: T.ExternalEntityCode,
        IsInterceptor: true,
        Filter: {},
        Mutator: {
            Mutator: EffectMutator.Cancel,
        },
    } as IAsInterceptor;
    state.interceptors.push(...[fluff, interceptor]);

    Cases.push([
        state,
        {
            Source: T.PlayerOneEntityCode,
            Targets: [identityToRemove],
            TargetType: TargetType.Interceptor,
            Effect: Effect.RemoveIntercept,

            MustMatch: 'all',
        } as IRemoveInterceptorEffectPack,
        'RemoveInterceptor removes interceptor - others interceptors present',
        {
            StackHeight: 0,
            interceptsHas: [fluff],
            interceptCount: 1,
        },
    ]);
})();

(() => {
    // We construct ourselves an interceptor
    let state = new GameState(T.GetDefaultPlayers());
    let identityToRemove;
    getRNGContext(state, (rng) => {
        identityToRemove = NewEntityCode(rng);
    });
    if (identityToRemove === undefined) throw Error('failed to fetch EntityCode');

    let interceptor = {
        Identity: identityToRemove,
        IsInterceptor: true,
        Filter: {},
        Mutator: {
            Mutator: EffectMutator.Cancel,
        },
    } as IAsInterceptor;
    state.interceptors.push(interceptor);

    Cases.push([
        state,
        {
            Source: T.PlayerOneEntityCode,
            Targets: [identityToRemove, T.ExternalEntityCode],
            TargetType: TargetType.Interceptor,
            Effect: Effect.RemoveIntercept,

            MustMatch: 'some',
        } as IRemoveInterceptorEffectPack,
        'RemoveInterceptor ignores missing when some MustMatch - some missing',
        {
            StackHeight: 0,
            interceptCount: 0,
        },
    ]);
})();

(() => {
    // We construct ourselves an interceptor
    let state = new GameState(T.GetDefaultPlayers());
    let identityToRemove;
    getRNGContext(state, (rng) => {
        identityToRemove = NewEntityCode(rng);
    });
    if (identityToRemove === undefined) throw Error('failed to fetch EntityCode');

    let fluff = {
        Identity: T.ExternalEntityCode,
        IsInterceptor: true,
        Filter: {},
        Mutator: {
            Mutator: EffectMutator.Cancel,
        },
    } as IAsInterceptor;
    // We did not create the identityToRemove interceptor, so it cannot exist
    state.interceptors.push(fluff);

    Cases.push([
        state,
        {
            Source: T.PlayerOneEntityCode,
            Targets: [identityToRemove],
            TargetType: TargetType.Interceptor,
            Effect: Effect.RemoveIntercept,

            MustMatch: undefined,
        } as IRemoveInterceptorEffectPack,
        'RemoveInterceptor ignores missing when not undefined MustMatch',
        {
            StackHeight: 0,
            interceptsHas: [fluff],
            interceptCount: 1,
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
    let caseNames = Cases.map(c => c[2]);
    let nameSet = new Set<String>(caseNames);
    if (nameSet.size !== caseNames.length) {
        throw Error('duplicated case name in IFilterState');
    }
})();

const tests = Cases.map(c => new SingleEffectTest(c));
export default tests;
