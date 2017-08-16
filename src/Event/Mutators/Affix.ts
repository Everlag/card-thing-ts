import {
    IEffectPack, IMutatorDescription, IEffectPackMutator,
    EffectPackMutatorAssertFail,
} from '../Header';

export enum AffixMutatorPlacment {
    Before = 'before-initial',
    After = 'after-initial',
}
export interface IAffixMutator extends IEffectPackMutator {
    Placement: AffixMutatorPlacment;

    Others: Array<IEffectPack>;
}
export function AsAffix(e: IEffectPackMutator): IAffixMutator {
    if (e.Mutator !== Self) {
        throw EffectPackMutatorAssertFail(Self, e.Mutator);
    }
    return e as IAffixMutator;
}

/**
 * Affix adds the 'Others' effects to be executed either
 * before or after. It does not modify the initial Effect.
 */
export function Op(pack: IEffectPack, mutator: IEffectPackMutator) {
    let affix = AsAffix(mutator);
    let included: Array<IEffectPack>;
    switch (affix.Placement) {
        case AffixMutatorPlacment.Before:
            included = [...affix.Others, pack];
            break;
        case AffixMutatorPlacment.After:
            included = [pack, ...affix.Others];
            break;
        default:
            throw Error('fell through exhaustive affix.Placement switch');
        }
    return included ;
};

export const Self = 'affix-effect';

export const Desc = {
    Op, Self,
} as IMutatorDescription;

export default Desc;
