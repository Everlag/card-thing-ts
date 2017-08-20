import * as T from '../test';
import {
    IEffectPack,
    IEffectPackAssert, EffectPackAssertError,
} from './Header';
import Players from '../Zone/Zones/Players';

type TestCase = [IEffectPack, IEffectPackAssert, String, boolean];

let cases = new Array<TestCase>();

import Damage, { AsDamage } from './Effects/Damage';
(() => {
    cases.push([
        {
            Source: T.PlayerOneEntityCode,
            Targets: [T.PlayerTwoEntityCode],
            TargetType: Players.TargetTypes.Player,
            Effect: Damage.Self,
        },
        AsDamage,
        'valid IDamageEffectPack does not throw',
        false,
    ]);
})();

import EndTurn from './Effects/EndTurn';
(() => {
    cases.push([
        {
            Source: T.PlayerOneEntityCode,
            Targets: [T.PlayerTwoEntityCode],
            TargetType: Players.TargetTypes.Player,
            Effect: EndTurn.Self,
        },
        AsDamage,
        'invalid IDamageEffectPack throws',
        true,
    ]);
})();

class AssertEffectTest extends T.Test {
    constructor(private testCase: TestCase) {
        super();
    }

    public Run() {
        let [pack, assert, name, doesThrow] = this.testCase;

        let thrown: Error | undefined;
        try {
            assert(pack);
        } catch (e) {
            thrown = e;
        }

        if (!(thrown instanceof EffectPackAssertError) &&
            thrown !== undefined) {
            throw Error(`unexpected thrown error from assertion
                    case - ${name}
                    got '${thrown.message}'`);
        }

        let msg = '';

        if (doesThrow && !thrown) {
            msg = `failed to fail assertion
                    case - ${name}`;
        }

        if (!doesThrow && thrown) {
            msg = `unexpected assertion fail
                    case - ${name}
                    got '${thrown.message}'`;
        }

        if (msg.length > 0) throw Error(msg);
    }
}

// Sanity check our cases before we package them up
(() => {
    let caseNames = cases.map(c => c[2]);
    let nameSet = new Set<String>(caseNames);
    if (nameSet.size !== caseNames.length) {
        throw Error('duplicated case name in AssertEffect');
    }
})();

const tests = cases.map(c => new AssertEffectTest(c));
export default tests;
