import {
    TestCase,
    MultiEffectTest, pushDesc,
} from '../../core/Event/MultiEffect_test';

// We require an explicit `export from` to allow us the ability
// to also export types.
//
// These are explicitly made available to our dependent tests
// and limit the dependency our tests can have on core.
//
// NOTE: this is positioned above the test imports as they depend
//       on these exports existing when they are evaluated.
//       TODO: consider breaking these exports out into a separate file
//             to remove a cyclic dependency.
export {
    TestCase, ISuiteDescription,
    CloneGameState,
} from '../../core/Event/MultiEffect_test';

let cases = new Array<TestCase>();

import StartTurnAndMove from './MultiEffectTests/StartTurnAndMove';
pushDesc(StartTurnAndMove, cases);

import StartTurnRollDoubles from './MultiEffectTests/StartTurnRollDoubles';
pushDesc(StartTurnRollDoubles, cases);

import PurchaseAndPay from './MultiEffectTests/PurchaseAndPay';
pushDesc(PurchaseAndPay, cases);

import MovePayRent from './MultiEffectTests/MovePayRent';
pushDesc(MovePayRent, cases);

import MovePassGo from './MultiEffectTests/MovePassGo';
pushDesc(MovePassGo, cases);

// Sanity check our cases before we package them up
(() => {
    let caseNames = cases.map(c => c[4]);
    let nameSet = new Set<String>(caseNames);
    if (nameSet.size !== caseNames.length) {
        throw Error('duplicated case name in IFilterState');
    }
})();

const tests = cases.map(c => new MultiEffectTest(c));
export default tests;
