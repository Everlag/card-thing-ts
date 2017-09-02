import { GameMachine } from '../../core/Game/Machine';
import {
    IEffectDescription, IMutatorDescription, FilterMatcher,
} from '../../core/Event/Header';
import { RegisterEffect } from '../../core/Event/Effect';
import { RegisterFilterMatcher } from '../../core/Event/Filter';
import { RegisterMutator } from '../../core/Event/Mutator';

import { EntityCode } from '../../core/Entity/Header';
import { IAsInterceptor } from '../../core/Entity/Entities/AsInterceptor';

import { getRNGContext } from '../../core/Game/Game';
import { NewEntityCode } from '../../core/Entity/EntityCode';
import Interceptors from '../../core/Zone/Zones/Interceptors';

/**
 * IRuleDependencies describes the supporting facets which must
 * be registered to allow the Rule to operate correctly.
 *
 * Failure to register these dependencies results in undefined behavior.
 */
export interface IRuleDependencies {
    Effects: Array<IEffectDescription>;
    Filters: Array<FilterMatcher>;
    Mutators: Array<IMutatorDescription>;
}

function installDepends(machine: GameMachine, rule: IRuleDependencies) {
    rule.Effects.forEach(e => {
        RegisterEffect(machine.effectRegister, e);
    });
    rule.Filters.forEach(f => {
        RegisterFilterMatcher(machine.filterRegister, f);
    });
    rule.Mutators.forEach(m => {
        RegisterMutator(machine.mutatorRegister, m);
    });
}

export function InstallRule(machine: GameMachine,
    rule: IRuleDescription) {

    installDepends(machine, rule.Depends);

    let identity: EntityCode = '';
    getRNGContext(machine.state, (rng)=> {
        identity = NewEntityCode(rng);
    });
    Interceptors.Add(rule.Create(identity), machine.state);
}

export type RuleCreator = (identity: EntityCode) => IAsInterceptor;

export interface IRuleDescription {
    Self: string;

    Depends: IRuleDependencies;
    Create: RuleCreator;
}
