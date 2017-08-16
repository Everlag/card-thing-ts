import {
    IEffectPack, IMutatorDescription, IEffectPackMutator,
} from '../Header';

/**
 * Cancel indicates that the provided Effect should not be applied.
 */
export function Op(pack: IEffectPack, mutator: IEffectPackMutator) {
    return null;
};

export const Self = 'cancel-effect';

export const Desc = {
    Op, Self,
} as IMutatorDescription;

export default Desc;
