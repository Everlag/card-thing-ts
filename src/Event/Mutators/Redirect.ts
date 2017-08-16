import {
    IEffectPack, IMutatorDescription, IEffectPackMutator,
    EffectPackMutatorAssertFail,
} from '../Header';
import { EntityCode } from '../../Entity/Header';

export enum RedirectMutatorDirection {
    ToSource = 'to-source',
    ToOthers = 'to-others',
}
export interface IRedirectMutator extends IEffectPackMutator {
    Direction: RedirectMutatorDirection;

    Others?: Array<EntityCode>;
}
export function AsRedirect(e: IEffectPackMutator): IRedirectMutator {
    if (e.Mutator !== Self) {
        throw EffectPackMutatorAssertFail(Self, e.Mutator);
    }
    return e as IRedirectMutator;
}

/**
 * StartTurn pushes a PlayerPriority per-playerr
 * and an EndTurn for the next positional player.
 * Target of StartTurn is the player whose turn
 * it is when this resolves.
 */
export function Op(pack: IEffectPack, mutator: IEffectPackMutator) {
    let redirect = AsRedirect(mutator);
    let mutable = Object.assign({}, pack) as IEffectPack;
    switch (redirect.Direction) {
        case RedirectMutatorDirection.ToSource:
            mutable.Targets = [pack.Source];
            break;
        case RedirectMutatorDirection.ToOthers:
            if (!redirect.Others) {
                throw Error('Others not defined on ToOthers redirect');
            }
            mutable.Targets = redirect.Others;
            break;
        default:
            throw Error('fell through redirect.Direction switch');
        }
    return [mutable];
};

export const Self = 'redirect-effect';

export const Desc = {
    Op, Self,
} as IMutatorDescription;

export default Desc;
