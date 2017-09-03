import { GameMachine } from '../Game/Machine';
import { RegisterEffect } from '../Event/Effect';
import { RegisterFilterMatcher } from '../Event/Filter';
import { RegisterMutator } from '../Event/Mutator';

import { EntityCode } from '../Entity/Header';

import { getRNGContext } from '../Game/Game';
import { NewEntityCode } from '../Entity/EntityCode';
import Interceptors from '../Zone/Zones/Interceptors';

import { IRuleDependencies, IRuleDescription } from './Header';

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

/**
 * InstallRule installs a rule into a given machine to ensure
 * it operates as expected.
 * @param machine GameMachine to register the Rule on
 * @param rule Rule to register
 */
export function InstallRule(machine: GameMachine,
    rule: IRuleDescription) {

    installDepends(machine, rule.Depends);

    let identity: EntityCode = '';
    getRNGContext(machine.state, (rng) => {
        identity = NewEntityCode(rng);
    });
    Interceptors.Add(rule.Create(identity), machine.state);
}
