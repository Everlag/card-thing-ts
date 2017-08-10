import { GameState } from '../Game/Game';
import * as T from '../test';
import { IFilterState, FilterMatches } from '../IFilterState';
import {
    EntityCode,
} from '../Entity/Header';
import {
    NewEndTurnEvent, NewStartTurnEvent, NewPlayerPriorityEvent,
} from './Event';
import {
    TestMachine, ResponseQueue, GetResponseQueue, AddResponsesToQueue,
} from '../TestMachine';
import {
    IEvent,
} from '../Event/Header';

/* tslint:disable */
// Disabling as it wants a trailing comma and we can't allow that.
type TestCase = [
    GameState, // Seed state
    Array<IEvent> | null, // Player 1
    Array<IEvent> | null, // Player 2, null to always pass.
    Number, // tickCount, number of ticks to run the machine for
    String, // Test name
    IFilterState // State filter which must match for success
];
/* tslint:enable */

let cases = new Array<TestCase>();

(() => {
    let expected = [
        NewStartTurnEvent(T.PlayerTwoEntityCode),
    ];

    let g = new GameState(T.GetDefaultPlayersWithMods(T.AlwaysQuery));
    g.stack.push(...[
        NewEndTurnEvent(T.PlayerOneEntityCode),
        NewPlayerPriorityEvent(T.PlayerTwoEntityCode),
        NewPlayerPriorityEvent(T.PlayerOneEntityCode),
    ]);

    cases.push([
        g,
        null,
        null,
        3,
        'Pass priority to next turn',
        {
            // UHHHH
            // Something is not right with player priority being appended.
            // currentTurn: T.PlayerOneEntityCode,
            stackHas: expected,
        },
    ]);
})();

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

class MultiEffectTest extends T.Test {
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
        ] = this.testCase;
        /* tslint:enable */

        let queue = buildQueue(this.testCase);

        let machine = new TestMachine(state, queue);

        for (let i = 0; i < tickCount; i++) {
            machine.tick();
        }

        console.log('my state is', state);

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
