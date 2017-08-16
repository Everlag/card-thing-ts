import {
    IEffectPack, IEffectPackMutator, EffectMutator,

    IMutatorDescription, Mutator,

    AsRedirect, RedirectMutatorDirection,
} from './Header';

let operatorRegister = new Map<string, Mutator>();

export function RegisterMutator(desc: IMutatorDescription) {
    if (operatorRegister.has(desc.Self)) {
        throw Error(`duplicated identifier for ${desc.Self}`);
    }
    operatorRegister.set(desc.Self, desc.Op);
    console.log('operator register looks like', operatorRegister);
}

import Cancel from './Mutators/Cancel';
RegisterMutator(Cancel);

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
