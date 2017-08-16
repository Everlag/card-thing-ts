import * as T from '../test';
import {
    IEffectPack, IEffectPackFilter,
    IEffectPackMutator,
} from './Header';
import {
    CheckFilter,
} from './Filter';
import {
    ApplyMutator,
} from './Mutator';

export type TestCase = [IEffectPack, IEffectPackMutator, String, IEffectPackFilter];

let cases = new Array<TestCase>();

import Cancel_test from './Mutators/Cancel_test';
cases.push(...Cancel_test);

import Redirect_test from './Mutators/Redirect_test';
cases.push(...Redirect_test);

class EffectPackMutatorTest extends T.Test {
    constructor(private testCase: TestCase) {
        super();
    }

    public Run() {
        let [pack, mutator, name, filter] = this.testCase;

        let result = ApplyMutator(pack, mutator);
        if (CheckFilter(result, filter)) return;

        let msg = `filter did not match post-mutation
        case - ${name}
        mutator - ${JSON.stringify(mutator)}
        pack    - ${JSON.stringify(pack)}
        result  - ${JSON.stringify(result)}
        filter  - ${JSON.stringify(filter)}`;

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
