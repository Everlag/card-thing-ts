import {
    GameState,
} from '../Game/Game';
import * as T from '../test';
import { IFilterState, FilterMatches } from '../IFilterState';
import { ApplyEffect } from './Effect';
import {
    IEffectPack,
} from './Header';

export type TestCase = [GameState, IEffectPack, String, IFilterState];

export const Cases = new Array<TestCase>();

import StartTurn_test from './Effects/StartTurn_test';
Cases.push(...StartTurn_test);

import EndTurn_test from './Effects/EndTurn_test';
Cases.push(...EndTurn_test);

import PlayerPriority_test from './Effects/PlayerPriority_test';
Cases.push(...PlayerPriority_test);

import Damage_test from './Effects/Damage_test';
Cases.push(...Damage_test);

import SetIntercept_test from './Effects/SetIntercept_test';
Cases.push(...SetIntercept_test);

import RemoveIntercept_test from './Effects/RemoveIntercept_test';
Cases.push(...RemoveIntercept_test);

class SingleEffectTest extends T.Test {
    constructor(private testCase: TestCase) {
        super();
    }

    public Run() {
        let [state, effect, name, matchingFilter] = this.testCase;

        state = ApplyEffect(effect, state, () => {
            throw Error('player choice was accessed');
        });

        let match = FilterMatches(state, matchingFilter);
        if (match === null) return;

        let msg = `state did not match filter
                case - ${name}
                ${match}`;

        throw Error(msg);
    }
}

// Sanity check our cases before we package them up
(() => {
    let caseNames = Cases.map(c => c[2]);
    let nameSet = new Set<String>(caseNames);
    if (nameSet.size !== caseNames.length) {
        throw Error('duplicated case name in IFilterState');
    }
})();

const tests = Cases.map(c => new SingleEffectTest(c));
export default tests;
