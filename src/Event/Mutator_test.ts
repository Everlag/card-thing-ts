import * as T from '../test';
import {
    TargetType, IEffectPack, Effect, IEffectPackMutator,
} from './Header';

type TestCase = [IEffectPack, IEffectPackMutator, String];

let cases = new Array<TestCase>();

class EffectPackMutatorTest extends T.Test {
    constructor(private testCase: TestCase) {
        super();
    }

    public Run() {
        let [pack, mutator, name] = this.testCase;

        throw new Error(`${name} test case unimplemented`);
    }
}

// Sanity check our cases before we package them up
(() => {
    let caseNames = cases.map(c => c[2]); // TODO: correct index
    let nameSet = new Set<String>(caseNames);
    if (nameSet.size !== caseNames.length) {
        throw Error('duplicated case name in EffectPackFilterTest');
    }
})();

const tests = cases.map(c => new EffectPackMutatorTest(c));
export default tests;
