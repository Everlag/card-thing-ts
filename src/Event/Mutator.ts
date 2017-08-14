import {
    IEffectPack, IEffectPackMutator, EffectMutator,

    AsRedirect, RedirectMutatorDirection,
} from './Header';

/**
 * Mutator is an operation associated with a specific EffectMutator.
 *
 * This performs the actual mutation of the IEffectPack.
 * The given IEffectPack should never be mutated, instead it should be
 * copied and returned.
 *
 * IEffectPackMutator is included as an argument as it may be extended
 *
 * A Mutator may return an explicitly null result to indicate the
 * IEffectPack should not be applied.
 */
type Mutator = (pack: IEffectPack,
    mutator: IEffectPackMutator) => IEffectPack | null;

let operatorRegister = new Map<EffectMutator, Mutator>();

operatorRegister.set(EffectMutator.Cancel,
    () => {
        return null;
    });

operatorRegister.set(EffectMutator.Redirect,
    (pack, mutator) => {
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
        return mutable;
    });

/**
 * ApplyMutator applies the given IEffectPackMutator to an
 * IEffectPack.
 *
 * Note: it is expected that any provided IEffectPack will have been
 * passed through an IEffectPackFilter to ensure compatibility as
 * the IEffectPackFilter may be asserted, ie with AsDamage().
 * @param pack an IEffectPack which mutator is compatible with
 * @param mutator IEffectPackMutator to be applied to the pack
 */
export function ApplyMutator(pack: IEffectPack,
        mutator: IEffectPackMutator): IEffectPack | null {

    let op = operatorRegister.get(mutator.Mutator);
    if (!op) {
        throw Error(`cannot apply unregisted mutator ${mutator.Mutator}`);
    }
    return op(pack, mutator);
}
