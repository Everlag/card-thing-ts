import {
    IRuleDependencies,
} from './Rules';

import {
    EntityCode, GlobalStateEntityCode
} from '../../core/Entity/Header';
import { IAsInterceptor } from '../../core/Entity/Entities/AsInterceptor';
import Players from '../../core/Zone/Zones/Players';
import Affix, {
    IAffixMutator, AffixMutatorPlacment,
} from '../../core/Event/Mutators/Affix';

import PassGo from '../Filters/PassGo';

import Move from '../Effects/Move';
import Pay, { IPayEffectPack } from '../Effects/Pay';

export function Create(identity: EntityCode): IAsInterceptor {
    return {
        Identity: identity,

        IsInterceptor: true,

        Filter: {
            Effect: Move.Self,
            PassesGo: true,
        },

        Mutator: {
            Mutator: Affix.Self,
            Placement: AffixMutatorPlacment.After,

            Others: [
                {
                    Effect: Pay.Self,

                    Source: GlobalStateEntityCode,
                    Targets: ['$replaced$'],
                    TargetType: Players.TargetTypes.Player,

                    Amount: 200,

                    Replacements: ['Targets'],
                } as IPayEffectPack,
            ],
        } as IAffixMutator,

    } as IAsInterceptor;
}

export const Depends = {
    Effects: [ Pay, Move ],

    Mutators: [],

    Filters: [
        PassGo,
    ],
};

export const Self = 'PassingGo';

export default {

} as IRuleDependencies;