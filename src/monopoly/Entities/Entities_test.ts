import {
    IGameState,
} from '../../core/Game/Header';
import {
    GameState,
} from '../../core/Game/Game';
import * as T from '../../core/test';

/**
 * EntityTestOperator is a generic function that takes in a
 * generic testing state and performs whatever operations it wants.
 *
 * As Entities have a large variety of operations, this is left
 * intentionally generic.
 *
 * It is always expected that the operator will throw if it fails
 * or not if it doesn't.
 */
export type EntityTestOperator = (state: IGameState) => void;

export type TestCase = [EntityTestOperator, String];

export const Cases = new Array<TestCase>();

import AsProperty_test from './AsProperty_test';
Cases.push(...AsProperty_test);

import WithMoney_test from './WithMoney_test';
Cases.push(...WithMoney_test);

import WithPosition_test from './WithPosition_test';
Cases.push(...WithPosition_test);

import WithPrice_test from './WithPrice_test';
Cases.push(...WithPrice_test);

import WithRent_test from './WithRent_test';
Cases.push(...WithRent_test);

import AsBuildable_test from './AsBuildable_test';
Cases.push(...AsBuildable_test);

import DataTransform_test from './DataTransform_test';
Cases.push(...DataTransform_test);

class EntityTest extends T.Test {
    constructor(private testCase: TestCase) {
        super();
    }

    public Run() {
        let [op, name] = this.testCase;

        let state = new GameState(T.GetDefaultPlayers());
        let thrown = '';
        try {
            op(state);
            return;
        }catch (e) {
            thrown = e.toString();
        }

        let msg = `unexpected throw ${thrown}
                case - ${name}`;

        throw Error(msg);
    }
}

// Sanity check our cases before we package them up
(() => {
    let caseNames = Cases.map(c => c[1]);
    let nameSet = new Set<String>(caseNames);
    if (nameSet.size !== caseNames.length) {
        throw Error('duplicated case name in Entities');
    }
})();

const tests = Cases.map(c => new EntityTest(c));
export default tests;
