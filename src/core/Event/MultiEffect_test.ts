import { GameState, GameStack } from '../Game/Game';
import { IGameState, IGameStack } from '../Game/Header';
import * as T from '../test';
import { IFilterState, FilterMatches } from '../IFilterState';
import {
    EntityCode,
} from '../Entity/Header';
import {
    TestMachine, ResponseQueue, GetResponseQueue, AddResponsesToQueue,
} from '../TestMachine';
import {
    IEvent, IEffectDescription,
} from '../Event/Header';
import { NewEffectRegister, RegisterEffect } from '../Event/Effect';
import { NewMutatorRegister } from '../Event/Mutator';
import { NewFilterMatcherRegister } from '../Event/Filter';

/* tslint:disable */
// Disabling as it wants a trailing comma and we can't allow that.
export type TestCase = [
    GameState, // Seed state
    Array<IEvent> | null, // Player 1
    Array<IEvent> | null, // Player 2, null to always pass.
    Number, // tickCount, number of ticks to run the machine for
    String, // Test name
    IFilterState, // State filter which must match for success
    Array<IEffectDescription> | undefined // non-core effects to register
];
/* tslint:enable */

/**
 * ISuiteDescription provides all information needed to register
 * and run a MultiEffect test suite.
 */
export interface ISuiteDescription {
    Self: string;
    Cases: Array<TestCase>;
}

/**
 * Acquire a deep-copy of the provided IGameStack
 *
 * Offered as a convenience function for tests which want to step
 * through identical GameState while only defining it once.
 */
export function CloneGameStack(s: IGameStack): IGameStack {
    // This is the most trivial way to accomplish what we want
    let raw = JSON.parse(JSON.stringify(s));
    return Object.assign(new GameStack(), raw);
}

/**
 * Acquire a deep-copy of the provided IGameState
 *
 * Offered as a convenience function for tests which want to step
 * through identical GameState while only defining it once.
 */
export function CloneGameState(s: IGameState): IGameState {
    // This is the most trivial way to accomplish what we want
    let raw = JSON.parse(JSON.stringify(s));
    // The provided players will be overwritten.
    let clone = Object.assign(new GameState(T.GetDefaultPlayers()), raw);
    // Necessary as the stack is defined as a class rather than as
    // as interface.
    clone.stack = CloneGameStack(s.stack);
    return clone;
}

let cases = new Array<TestCase>();

/**
 * Prepend each provided case with the provided prefix and
 * add it to our cases.
 *
 * This allows duplication of case names across tests without issue
 * and is more descriptive when viewing errors.
 *
 * NOTE: the provided cases will have their names permanently modified.
 */
export function pushDesc(desc: ISuiteDescription, existing: Array<TestCase>) {
    desc.Cases.forEach(c => {
        let name = c[4];
        name = `${desc.Self} | ${name}`;
        c[4] = name;
    });
    existing.push(...desc.Cases);
}

import PassPriorityToNextTurn from './MultiEffect_test/PassPriorityToNextTurn';
pushDesc(PassPriorityToNextTurn, cases);

import InterceptThrowGuardAndRemove from './MultiEffect_test/InterceptThrowGuardAndRemove';
pushDesc(InterceptThrowGuardAndRemove, cases);

import InterceptForExtraTurn from './MultiEffect_test/InterceptForExtraTurn';
pushDesc(InterceptForExtraTurn, cases);

import CancelAsPlayerResponse from './MultiEffect_test/CancelAsPlayerResponse';
pushDesc(CancelAsPlayerResponse, cases);

// buildQueue constructs a ResponseQueue from a TestCase
function buildQueue(c: TestCase): ResponseQueue {
    /* tslint:disable */
    // Disabling to allow destructuring without warning
    let [
        _,
        player1Responses,
        player2Responses,
    ] = c;
    /* tslint:enable */

    let activePlayers = new Array<EntityCode>();
    if (player1Responses !== null) activePlayers.push(T.PlayerOneEntityCode);
    if (player2Responses !== null) activePlayers.push(T.PlayerTwoEntityCode);

    let queue = GetResponseQueue(...activePlayers);
    if (player1Responses !== null) {
        AddResponsesToQueue(T.PlayerOneEntityCode,
            queue, player1Responses);
    }
    if (player2Responses !== null) {
        AddResponsesToQueue(T.PlayerTwoEntityCode,
            queue, player2Responses);
    }

    return queue;
}

export class MultiEffectTest extends T.Test {
    constructor(private testCase: TestCase) {
        super();
    }

    public Run() {
        /* tslint:disable */
        // Disabling to allow destructuring without warning
        let [
            state,
            _,
            _2,
            tickCount,
            name, matchingFilter,
            effectsToRegister,
        ] = this.testCase;
        /* tslint:enable */

        let queue = buildQueue(this.testCase);

        let effectRegister = NewEffectRegister();
        if (effectsToRegister !== undefined) {
            effectsToRegister.forEach(e => {
                RegisterEffect(effectRegister, e);
            });
        }

        let mutatorRegister = NewMutatorRegister();
        let filterRegister = NewFilterMatcherRegister();
        let machine = new TestMachine(state,
            effectRegister, filterRegister, mutatorRegister, queue);

        try {
            for (let i = 0; i < tickCount; i++) {
                machine.tick();
            }
        } catch (e) {
            throw Error(`unexpected Error
            case - ${name}
            error - ${e.toString()}`);
        }

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
    let caseNames = cases.map(c => c[4]);
    let nameSet = new Set<String>(caseNames);
    if (nameSet.size !== caseNames.length) {
        throw Error('duplicated case name in IFilterState');
    }
})();

const tests = cases.map(c => new MultiEffectTest(c));
export default tests;
