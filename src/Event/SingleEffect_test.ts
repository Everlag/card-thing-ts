import {
    GameState, getRNGContext,
} from '../Game/Game';
import * as T from '../test';
import { IFilterState, FilterMatches } from '../IFilterState';
import {
    IAsInterceptor,
} from '../Entity/Header';
import { NewEntityCode } from '../Entity/EntityCode';
import { ApplyEffect } from './Effect';
import {
    Effect, IEffectPack, TargetType, IRemoveInterceptorEffectPack,
    EffectMutator,
} from './Header';

export type TestCase = [GameState, IEffectPack, String, IFilterState];

export const Cases = new Array<TestCase>();

import StartTurn_test from './Effects/StartTurn_test';
Cases.push(...StartTurn_test);

import EndTurn_test from './Effects/EndTurn_test';
Cases.push(...EndTurn_test);

import PlayerPriority_test from './Effects/PlayerPriority_test';
Cases.push(...PlayerPriority_test);

import Damage_test from './Effects/Damage_test';
Cases.push(...Damage_test);

import SetIntercept_test from './Effects/SetIntercept_test';
Cases.push(...SetIntercept_test);

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
