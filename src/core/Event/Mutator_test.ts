import * as T from '../test';
import {
    IEffectPack, IEffectPackFilter,
    IEffectPackMutator,
} from './Header';
import {
    CheckFilter, NewFilterMatcherRegister,
} from './Filter';
import {
    NewMutatorRegister, ApplyMutator,
} from './Mutator';

export type TestCase = [
    IEffectPack,
    IEffectPackMutator,
    String,
    Array<IEffectPackFilter>];

let cases = new Array<TestCase>();

import Cancel_test from './Mutators/Cancel_test';
cases.push(...Cancel_test);

import Redirect_test from './Mutators/Redirect_test';
cases.push(...Redirect_test);

import Affix_test from './Mutators/Affix_test';
cases.push(...Affix_test);

class EffectPackMutatorTest extends T.Test {
    constructor(private testCase: TestCase) {
        super();
    }

    public Run() {
        let [pack, mutator, name, filters] = this.testCase;

        let mutatorRegister = NewMutatorRegister();

        let results = ApplyMutator(mutatorRegister, pack, mutator);
        if (results.length !== filters.length) {
            let msg = `results length did not match expected filter length
            case - ${name}
            results - ${JSON.stringify(results)}
            `;
            throw Error(msg);
        }

        let filterRegister = NewFilterMatcherRegister();
        let checked = filters.map((f, i) => {
            if (CheckFilter(filterRegister, results[i], f)) return null;
            return results[i];
        });
        if (checked.every(v => v === null)) return;

        let msg = `some filters did not match post-mutation
        case - ${name}
        mutator - ${JSON.stringify(mutator)}
        pack    - ${JSON.stringify(pack)}
        results  - ${JSON.stringify(results)}
        filters  - ${JSON.stringify(filters)}`;

        throw new Error(msg);
    }
}

// Sanity check our cases before we package them up
(() => {
    let caseNames = cases.map(c => c[2]);
    let nameSet = new Set<String>(caseNames);
    if (nameSet.size !== caseNames.length) {
        throw Error('duplicated case name in EffectPackMutatorTest');
    }
})();

const tests = cases.map(c => new EffectPackMutatorTest(c));
export default tests;
