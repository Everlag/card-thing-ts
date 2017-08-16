import { TestCase } from '../SingleEffect_test';
import {
    GameState, getRNGContext,
} from '../../Game/Game';
import * as T from '../../test';
import {
    GlobalStateEntityCode,
} from '../../Entity/Header';
import { IAsInterceptor } from '../../Entity/Entities/AsInterceptor';
import { NewEntityCode } from '../../Entity/EntityCode';
import {
    TargetType,
} from './../Header';
import SetIntercept, { ISetInterceptorEffectPack } from './SetIntercept';

let cases: Array<TestCase> = [];

let fakeMutator = 'some-mutator';

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
            Mutator: fakeMutator,
        },
    } as IAsInterceptor;
    let expectedInterceptors = [interceptor];

    cases.push([
        new GameState(T.GetDefaultPlayers()),
        {
            Source: T.PlayerOneEntityCode,
            Targets: [GlobalStateEntityCode],
            TargetType: TargetType.Global,
            Effect: SetIntercept.Self,

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

export default cases;
