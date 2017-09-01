import {
    TestCase, EffectPackFilterTest,
} from '../../core/Event/Filter_test';

export type TestCase = TestCase;

export const Cases = new Array<TestCase>();

import PassGo_test from './PassGo_test';
Cases.push(...PassGo_test);

// Sanity check our cases before we package them up
(() => {
    let caseNames = Cases.map(c => c[3]);
    let nameSet = new Set<String>(caseNames);
    if (nameSet.size !== caseNames.length) {
        throw Error('duplicated case name in Monopoly Filter_test');
    }
})();

const tests = Cases.map(c => new EffectPackFilterTest(c));
export default tests;
