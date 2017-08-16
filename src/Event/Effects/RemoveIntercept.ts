import {
    TargetType,
    IEffectPack, IEffectDescription,
    EffectPackAssertFail,
} from '../Header';
import {
    IGameState,
} from '../../Game/Header';

export interface IRemoveInterceptorEffectPack extends IEffectPack {
    // MustMatch causes the Effect to throw if it cannot match a target.
    //
    // This has two mode:
    // - 'all' enforces that all targets must exist
    // - 'some' enforces that at least one target must exist
    MustMatch?: 'all' | 'some';
}
export function AsRemoveInterceptor(e: IEffectPack): IRemoveInterceptorEffectPack {
    if (e.Effect !== Self) {
        throw EffectPackAssertFail(Self, e.Effect);
    }
    return e as IRemoveInterceptorEffectPack;
}

/**
 * RemoveIntercept removes an Interceptor from the GameState.
 */
export function Op(state: IGameState, pack: IEffectPack) {
    if (pack.Targets.length < 1) {
        throw Error(`RemoveIntercept expects at least one target, got ${pack.Targets}`);
    }

    let interceptorPack = AsRemoveInterceptor(pack);

    if (interceptorPack.TargetType !== TargetType.Interceptor) {
        throw Error(`unknown TargetType for RemoveIntercept: ${pack.TargetType}`);
    }

    // Validate targets existence.
    let someMatch = false;
    let allMatch = true;
    pack.Targets.forEach(t => {
        let found = state.interceptors.some(intercept => {
            return intercept.Identity === t;
        });
        someMatch = found || someMatch;
        allMatch = found && allMatch;
    });
    switch (interceptorPack.MustMatch) {
        case 'all':
            if (!allMatch) {
                throw Error(`failed to match all targets when required
                ${JSON.stringify(pack)}`);
            }
            break;
        case 'some':
        if (!someMatch) {
            throw Error(`failed to match any targets when required
                ${JSON.stringify(pack)}`);
            }
            break;
        case undefined:
            break;
        default:
            throw Error('fell through exhaustive MustMatch switch');
    }

    // Remove targets
    state.interceptors = state.interceptors
        .filter(i => {
            return !pack.Targets.some(target => target === i.Identity);
        });

    return state;
}

export const Self = 'remove-interceptor';

export const Desc = {
    Op, Self,
} as IEffectDescription;

export default Desc;
