import {
    TargetType,
    IEffectPack, IEffectDescription,
    IEffectPackFilter, IEffectPackMutator,
    EffectPackAssertFail,
} from '../Header';
import {
    IGameState,
} from '../../Game/Header';
import {
    getRNGContext,
} from '../../Game/Game';
import { EntityCode } from '../../Entity/Header';
import { IAsInterceptor } from '../../Entity/Entities/AsInterceptor';
import {
    NewEntityCode,
} from '../../Entity/EntityCode';

export interface ISetInterceptorEffectPack extends IEffectPack {
    Filter: IEffectPackFilter;
    Mutator: IEffectPackMutator;
}
export function AsInterceptor(e: IEffectPack): ISetInterceptorEffectPack {
    if (e.Effect !== Self) {
        throw EffectPackAssertFail(Self, e.Effect);
    }
    return e as ISetInterceptorEffectPack;
}

/**
 * SetIntercept establishes an Interceptor in the GameState.
 */
export function Op(state: IGameState, pack: IEffectPack) {
    if (pack.Targets.length !== 1) {
        throw Error(`SetIntercept expects single target, got ${pack.Targets}`);
    }

    let interceptorPack = AsInterceptor(pack);

    if (interceptorPack.TargetType !== TargetType.Global) {
        throw Error(`unknown TargetType for SetIntercept: ${pack.TargetType}`);
    }

    // Fetch an EntityCode
    //
    // We require a dummy assignment as a result of the
    // use of a callback to access the RNG context.
    let identity: EntityCode = '';
    getRNGContext(state, (rng) => {
        identity = NewEntityCode(rng);
    });

    let interceptor: IAsInterceptor = {
        Identity: identity,

        IsInterceptor: true,
        Filter: interceptorPack.Filter,
        Mutator: interceptorPack.Mutator,
    };

    state.interceptors.push(interceptor);

    return state;
}

export const Self = 'set-interceptor';

export const Desc = {
    Op, Self,
} as IEffectDescription;

export default Desc;
