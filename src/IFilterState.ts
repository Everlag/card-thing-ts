import * as G from './Game/Header';
import { IEvent } from './Event/Header';
import { IPlayer } from './Player/Header';
import { EntityCode } from './Entity/Header';
import { IAsInterceptor } from './Entity/Entities/AsInterceptor';

import { diff as deepdiff } from 'deep-diff';

function diffString(a: any, b: any): String {
    let delta = deepdiff(a, b);
    return JSON.stringify(delta, null, 2);
}

// PathString is a string representing the path to a property
// on an object. These are formatted as
// accessor1.accessor2.(...).property
type PathString = String;

// PathStringRegex defined the format of a valid PathString.
//
// Specifically, this validates that we can essentially
// split on '.' to programmatically traverse an object.
const PathStringRegex = /^(\w{1,}\.)*\w*$/;

// IFilterState matches a GameState if its declared attributes
// match. Any non-existent(undefined) attribute is considered
// to always match.
export interface IFilterState {
    // phase matches when the game is in the provided Phase
    phase?: G.Phase;

    // currentTurn matches when the current turn is held by the
    // player with the provided entity code.
    currentTurn?: EntityCode;

    // stackHas matches when the provided set of IEvent is
    // present in the GameStack in the provided order.
    stackHas?: Array<IEvent>;

    StackHeight?: number;

    // playerHas matches when all players in the map have
    // all specified properties with specified values.
    playerHas?: Map<EntityCode, Map<PathString, String | number>>;

    // interceptHas matches when the provided set of intercepts
    // exists in the provided order.
    interceptsHas?: Array<IAsInterceptor>;
    // interceptCount matches when the number of intercepts in the
    // state is exactly equal to this specified count.
    interceptCount?: number;
}

// FilterMatches returns null on a match or an error string declaring what
// failed to match.
export function FilterMatches(s: G.IGameState,
    f: IFilterState): String | null {

    let phaseMatch = FilterMatchString(s.phase, f.phase, 'phase');
    if (phaseMatch) return phaseMatch;

    let currentTurnMatch = FilterMatchString(s.currentTurn, f.currentTurn,
        'currentTurn');
    if (currentTurnMatch) return currentTurnMatch;

    let stackHasMatch = FilterMatchSubArray(s.stack.contents(),
        f.stackHas, 'stackHas');
    if (stackHasMatch) return stackHasMatch;

    let stackHeightMatch = FilterMatchLength(s.stack.contents(),
        f.StackHeight, 'stackHeight');
    if (stackHeightMatch) return stackHeightMatch;

    let filterMatchPlayers = FilterMatchPlayers(s.players,
        f.playerHas);
    if (filterMatchPlayers) return filterMatchPlayers;

    let interceptHasMAtch = FilterMatchSubArray(s.interceptors,
        f.interceptsHas, 'interceptHas');
    if (interceptHasMAtch) return interceptHasMAtch;

    let interceptCountMatch = FilterMatchLength(s.interceptors,
        f.interceptCount, 'interceptCount');
    if (interceptCountMatch) return interceptCountMatch;

    return null;
}

export function FilterMatchString(state: String,
    expected: String | undefined,
    propertyName: String): String | null {

    if (expected === undefined ||
        state === expected) return null;

    return `${propertyName} did not match
    >>expected:
    ${expected}
    >>got:
    ${state}`;
}

export function FilterMatchPlayers(state: Array<IPlayer>,
    expected: Map<EntityCode, Map<PathString, String | number>> | undefined): String | null {

    if (!expected) return null;
    let results = new Array<String | null>();
    expected.forEach((propertyMatcher, entity) => {
        let player = state.find(p => p.Self.Identity === entity);
        if (player === undefined) return `unknwon player ${entity}`;

        results.push(FilterMatchPlayer(player, propertyMatcher));
    });

    let filtered = results.filter(v => v !== null);
    if (filtered.length === 0) return null;
    return filtered.join('\n');
}

export function FilterMatchPlayer(state: IPlayer,
    expected: Map<PathString, String | number>): String | null {

    if (expected === undefined) return null;

    let results = new Array<String | null>();
    expected.forEach((value, path) => {
        let result = FilterMatchPath(path, state, value);
        results.push(result);
    });

    let filtered = results.filter(v => v !== null);
    if (filtered.length === 0) return null;
    return filtered.join('\n');
}

function FilterMatchPath(path: PathString,
    state: any,
    expected: String | number): String | null {

    let matches = PathStringRegex.test(path.toString());
    if (!matches) return `${path} is an invalidly formatted PathString`;

    let accessors = path.split('.');
    let value = accessors.reduce((prevState, a, i) => {
        if (typeof (prevState) !== 'object') {
            return `${path} terminated early at ${a}, index ${i}`;
        }

        return prevState[a];
    }, state);

    if (value !== expected) {
        return `${path} did not contain expected value
        >>expected:
        ${expected}
        >>got:
        ${value}`;
    }

    return null;
}

export function FilterMatchSubArray(state: Array<any>,
    expected: Array<any> | undefined,
    propertyName: String): String | null {

    if (expected === undefined) return null;

    let stateSerial = state.map(item => JSON.stringify(item, null, 2));
    let expectedSerial = expected.map(item => JSON.stringify(item, null, 2));

    let expectedMatchDepth = 0;
    let expectedFirstMatch = -1;
    stateSerial.forEach((item, i) => {
        if (expectedSerial.length <= expectedMatchDepth) return;

        let expectedItem = expectedSerial[expectedMatchDepth];
        let matches = item === expectedItem;
        if (matches && expectedMatchDepth === 0) {
            expectedFirstMatch = i;
        }
        if (matches) {
            expectedMatchDepth++;
        }
    });

    // Matched, we're good.
    if (expectedMatchDepth === expected.length) return null;

    // Not a single match
    if (expectedFirstMatch === -1) {
        return `${propertyName} did not match at all
        >>expected:
        ${expectedSerial}
        >>got:
        ${stateSerial}`;
    }

    // let matchStartSubset = stateSerial.slice(expectedFirstMatch);
    let matchStartSubset = state.slice(expectedFirstMatch);

    let diff = diffString(expected, matchStartSubset);

    return `${propertyName} partial match
    >>expected:
    ${expectedSerial}
    >>got:
    ...${JSON.stringify(matchStartSubset, null, 2)}
    >>diff:
    ${diff}`;
}

export function FilterMatchLength(state: Array<any>,
    expected: number | undefined,
    propertyName: String): String | null {

    if (expected === undefined ||
        state.length === expected) return null;

    return `${propertyName} mismatched length
    >>expected:
    length = ${expected}
    >>got:
    length = ${state.length}
    ${JSON.stringify(state, null, 2)}`;
}
