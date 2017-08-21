import {
    IMutatorRegister,
    IEffectPack, IEffectPackMutator,

    IMutatorDescription, Mutator,
} from './Header';

let coreRegister: IMutatorRegister = {
    Register: new Map<string, Mutator>(),
};

export function RegisterMutator(desc: IMutatorDescription) {
    if (coreRegister.Register.has(desc.Self)) {
        throw Error(`duplicated identifier for ${desc.Self}`);
    }
    coreRegister.Register.set(desc.Self, desc.Op);
    console.log('operator register looks like', coreRegister);
}

import Cancel from './Mutators/Cancel';
RegisterMutator(Cancel);

import Redirect from './Mutators/Redirect';
RegisterMutator(Redirect);

import Affix from './Mutators/Affix';
RegisterMutator(Affix);

/**
 * NewMutatorRegister constructs a MutatorRegister
 * with all core operations already registered.
 */
export function NewMutatorRegister(): IMutatorRegister {
    let register: IMutatorRegister = {
        Register: new Map(),
    };

    coreRegister.Register
        .forEach((op, effect) => register.Register.set(effect, op));

    return register;
}

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
export function ApplyMutator(register: IMutatorRegister,
        pack: IEffectPack,
        mutator: IEffectPackMutator): Array<IEffectPack | null> {

    let op = register.Register.get(mutator.Mutator);
    if (!op) {
        throw Error(`cannot apply unregisted mutator ${mutator.Mutator}`);
    }
    return op(pack, mutator);
}
