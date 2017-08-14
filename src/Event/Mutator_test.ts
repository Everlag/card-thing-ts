import * as T from '../test';
import {
    TargetType, IEffectPack, IEffectPackFilter, Effect, EffectMutator,
    IEffectPackMutator,
} from './Header';
import {
    CheckFilter,
} from './Filter';
import {
    ApplyMutator,
} from './Mutator';

type TestCase = [IEffectPack, IEffectPackMutator, String, IEffectPackFilter];

let cases = new Array<TestCase>();

cases.push([
    {
        Source: T.PlayerOneEntityCode,
        Targets: [T.PlayerOneEntityCode],
        TargetType: TargetType.Player,
        Effect: Effect.EndTurn,
    },
    {
        Mutator: EffectMutator.Cancel,
    },
    'Cancel results in Null value',
    {
        Null: true,
    },
]);

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
    let caseNames = cases.map(c => c[2]); // TODO: correct index
    let nameSet = new Set<String>(caseNames);
    if (nameSet.size !== caseNames.length) {
        throw Error('duplicated case name in EffectPackFilterTest');
    }
})();

const tests = cases.map(c => new EffectPackMutatorTest(c));
export default tests;
