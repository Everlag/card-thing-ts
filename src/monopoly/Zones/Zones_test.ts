import {
    IGameState,
} from '../../core/Game/Header';
import {
    GameState,
} from '../../core/Game/Game';
import * as T from '../../core/test';

/**
 * ZoneTestOperator is a generic function that takes in a
 * generic testing state and performs whatever operations it wants.
 *
 * It is always expected that the operator will throw if it fails
 * or not if it doesn't.
 */
export type ZoneTestOperator = (state: IGameState) => void;

export type TestCase = [ZoneTestOperator, String];

export const Cases = new Array<TestCase>();

import Properties_test from './Properties_test';
Cases.push(...Properties_test);

class ZoneTest extends T.Test {
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
        throw Error('duplicated case name in Zones');
    }
})();

const tests = Cases.map(c => new ZoneTest(c));
export default tests;
