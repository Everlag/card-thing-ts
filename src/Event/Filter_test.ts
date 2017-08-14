import * as T from '../test';
import {
    CheckFilter
} from './Filter';
import {
    TargetType, IEffectPack, Effect, IEffectPackFilter,
} from './Header';

type TestCase = [IEffectPack, IEffectPackFilter, String, boolean];

let cases = new Array<TestCase>();

class EffectPackFilterTest extends T.Test {
    constructor(private testCase: TestCase) {
        super();
    }

    public Run() {
        let [pack, filter, name, shouldMatch] = this.testCase;

        if (CheckFilter(pack, filter) === shouldMatch) return;

        let msg;
        if (shouldMatch) {
            msg = `failed to match when expected
            case - ${name}`;
        }else {
            msg = `unexpected match`;
        }
        msg = msg.concat(`IEffectPack - ${JSON.stringify(pack)}
            Filter - ${JSON.stringify(filter)}`);

        throw Error(msg);
    }
}

// Sanity check our cases before we package them up
(() => {
    let caseNames = cases.map(c => c[2]);
    let nameSet = new Set<String>(caseNames);
    if (nameSet.size !== caseNames.length) {
        throw Error('duplicated case name in EffectPackFilterTest');
    }
})();

const tests = cases.map(c => new EffectPackFilterTest(c));
export default tests;
