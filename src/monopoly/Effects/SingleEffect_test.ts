import {
    TestCase, SingleEffectTest,
} from '../../core/Event/SingleEffect_test';

export type TestCase = TestCase;

export const Cases = new Array<TestCase>();

import Move_test from './Move_test';
Cases.push(...Move_test);

import StartTurn_test from './StartTurn_test';
Cases.push(...StartTurn_test);

import Purchase_test from './Purchase_test';
Cases.push(...Purchase_test);

import Pay_test from './Pay_test';
Cases.push(...Pay_test);

// Sanity check our cases before we package them up
(() => {
    let caseNames = Cases.map(c => c[2]);
    let nameSet = new Set<String>(caseNames);
    if (nameSet.size !== caseNames.length) {
        throw Error('duplicated case name in Monopoly SingleEffect_test');
    }
})();

const tests = Cases.map(c => new SingleEffectTest(c));
export default tests;
