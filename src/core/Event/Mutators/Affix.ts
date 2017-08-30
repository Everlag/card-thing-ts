import {
    IEffectPack, IMutatorDescription, IEffectPackMutator,
    EffectPackMutatorAssertFail,
} from '../Header';

/**
 * IAffixEffectPack extends IEffectPack to allow property replacements
 * to be described using a single field.
 */
export interface IAffixReplaceEffectPack extends IEffectPack {
    Replacements?: Array<string>;
}

export enum AffixMutatorPlacment {
    Before = 'before-initial',
    After = 'after-initial',
}
export interface IAffixMutator extends IEffectPackMutator {
    Placement: AffixMutatorPlacment;

    Others: Array<IAffixReplaceEffectPack>;
}
export function AsAffix(e: IEffectPackMutator): IAffixMutator {
    if (e.Mutator !== Self) {
        throw EffectPackMutatorAssertFail(Self, e.Mutator);
    }
    return e as IAffixMutator;
}

/**
 * AffixOthersAsMutable returns a copy of the provided effect packs
 * which can be mutated independently of the source.
 */
function AffixOthersAsMutable(
    original: Array<IAffixReplaceEffectPack>,
): Array<IAffixReplaceEffectPack> {

    return JSON.parse(JSON.stringify(original));
}

/**
 * PerformReplacements replaces properties on mutClone with the
 * specified properties of source.
 */
function PerformReplacements(
    source: IEffectPack, mutClone: IAffixReplaceEffectPack,
): IAffixReplaceEffectPack {

    if (mutClone.Replacements === undefined) return mutClone;

    mutClone.Replacements.forEach(replace => {
        mutClone[replace] = source[replace];
    });

    return mutClone;
}

/**
 * Affix adds the 'Others' effects to be executed either
 * before or after. It does not modify the initial Effect.
 */
export function Op(pack: IEffectPack, mutator: IEffectPackMutator) {
    let affix = AsAffix(mutator);

    let cloned = AffixOthersAsMutable(affix.Others)
        .map(a => PerformReplacements(pack, a));

    let included: Array<IEffectPack>;
    switch (affix.Placement) {
        case AffixMutatorPlacment.Before:
            included = [...cloned, pack];
            break;
        case AffixMutatorPlacment.After:
            included = [pack, ...cloned];
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
