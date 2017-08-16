import { TestCase } from '../SingleEffect_test';
import {
    GameState, getRNGContext,
} from '../../Game/Game';
import * as T from '../../test';
import { IAsInterceptor } from '../../Entity/Entities/AsInterceptor';
import { NewEntityCode } from '../../Entity/EntityCode';
import {
    TargetType,
} from './../Header';
import RemoveIntercept,
    { IRemoveInterceptorEffectPack } from './RemoveIntercept';

let cases: Array<TestCase> = [];

let fakeMutator = 'some-mutator';

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
            Mutator: fakeMutator,
        },
    } as IAsInterceptor;
    state.interceptors.push(interceptor);

    cases.push([
        state,
        {
            Source: T.PlayerOneEntityCode,
            Targets: [identityToRemove],
            TargetType: TargetType.Interceptor,
            Effect: RemoveIntercept.Self,

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
            Mutator: fakeMutator,
        },
    } as IAsInterceptor;
    let fluff = {
        Identity: T.ExternalEntityCode,
        IsInterceptor: true,
        Filter: {},
        Mutator: {
            Mutator: fakeMutator,
        },
    } as IAsInterceptor;
    state.interceptors.push(...[fluff, interceptor]);

    cases.push([
        state,
        {
            Source: T.PlayerOneEntityCode,
            Targets: [identityToRemove],
            TargetType: TargetType.Interceptor,
            Effect: RemoveIntercept.Self,

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
            Mutator: fakeMutator,
        },
    } as IAsInterceptor;
    state.interceptors.push(interceptor);

    cases.push([
        state,
        {
            Source: T.PlayerOneEntityCode,
            Targets: [identityToRemove, T.ExternalEntityCode],
            TargetType: TargetType.Interceptor,
            Effect: RemoveIntercept.Self,

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
            Mutator: fakeMutator,
        },
    } as IAsInterceptor;
    // We did not create the identityToRemove interceptor, so it cannot exist
    state.interceptors.push(fluff);

    cases.push([
        state,
        {
            Source: T.PlayerOneEntityCode,
            Targets: [identityToRemove],
            TargetType: TargetType.Interceptor,
            Effect: RemoveIntercept.Self,

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

export default cases;
