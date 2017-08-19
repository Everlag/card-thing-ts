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
import Interceptors from '../../Zone/Zones/Interceptors';
import RemoveIntercept,
    { IRemoveInterceptorEffectPack } from './RemoveIntercept';
import Affix, { IAffixMutator, AffixMutatorPlacment } from '../Mutators/Affix';


export interface ISetInterceptorEffectPack extends IEffectPack {
    Filter: IEffectPackFilter;
    Mutator: IEffectPackMutator;

    /**
     * Expiry being set will establish an additional intercept
     * which will trigger on the filtered Effect to remove
     * this interceptor.
     *
     * Expiry will be removed after it fires once.
     */
    Expiry?: IEffectPackFilter;
}
export function AsInterceptor(e: IEffectPack): ISetInterceptorEffectPack {
    if (e.Effect !== Self) {
        throw EffectPackAssertFail(Self, e.Effect);
    }
    return e as ISetInterceptorEffectPack;
}

/**
 * registerExpiry sets an interceptor to remove the interceptor
 * identified by the provided identity when the expiryFilter matches
 * an Effect.
 *
 * Note: the expiry will expire both the identified expiry as well as
 *       itself, that means it cleans up after it has executed.
 * @param state where the interceptor will be registered
 * @param expiryFilter filter which must match to expire the interceptor
 * @param identity identifier for the interceptor which will expire
 */
function registerExpiry(state: IGameState,
    expiryFilter: IEffectPackFilter, identity: EntityCode): IGameState {

    let expiryIdentity: EntityCode = '';
    getRNGContext(state, (rng) => {
        expiryIdentity = NewEntityCode(rng);
    });

    let expiry = {
        Source: identity,
        Targets: [identity],
        TargetType: TargetType.Interceptor,
        Effect: RemoveIntercept.Self,
    } as IRemoveInterceptorEffectPack;
    let selfExpiry = {
        Source: expiryIdentity,
        Targets: [expiryIdentity],
        TargetType: TargetType.Interceptor,
        Effect: RemoveIntercept.Self,
    } as IRemoveInterceptorEffectPack;
    let expiryInterceptor: IAsInterceptor = {
        Identity: expiryIdentity,

        IsInterceptor: true,
        Filter: expiryFilter,
        Mutator: {
            Mutator: Affix.Self,
            Others: [expiry, selfExpiry],
            // Placement after is very important to allow them to fire
            // if they would on the event that should remove them.
            Placement: AffixMutatorPlacment.After,
        } as IAffixMutator,
    };
    Interceptors.Add(expiryInterceptor, state);

    return state;
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

    Interceptors.Add(interceptor, state);

    // Register expiry if declared
    if (interceptorPack.Expiry) {
        state = registerExpiry(state, interceptorPack.Expiry, identity);
    }
    return state;
}

export const Self = 'set-interceptor';

export const Desc = {
    Op, Self,
} as IEffectDescription;

export default Desc;
