import * as G from './Game/Header';
import { IEvent } from './Event/Header';
import { EntityCode, IEntity } from './Entity/Header';
import { ZoneCode } from './Zone/Header';
import { GetZone, GetEntity } from './Zone/Internal';

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
    // currentTurn matches when the current turn is held by the
    // player with the provided entity code.
    currentTurn?: EntityCode;

    // stackHas matches when the provided set of IEvent is
    // present in the GameStack in the provided order.
    stackHas?: Array<IEvent>;

    StackHeight?: number;

    // entityPathHas matches when all Entities in the map have
    // all specified properties with specified values.
    //
    // This allows significantly easier matching on desired
    // characteristics than using zoneContains for an exact, ordered match
    entityPathHas?: Map<EntityCode, Map<PathString, String | number>>;

    // zoneHas matches when all Zones in the map have all
    // IEntities existing within their ordered representation
    // in the provided order.
    zoneHas?: Map<ZoneCode, Array<IEntity>>;

    // zoneCount matches when the number of Entities in the Zone
    // is exactly equal to the number specified.
    zoneCount?: Map<ZoneCode, number>;
}

// FilterMatches returns null on a match or an error string declaring what
// failed to match.
export function FilterMatches(s: G.IGameState,
    f: IFilterState): String | null {

    let currentTurnMatch = FilterMatchString(s.currentTurn, f.currentTurn,
        'currentTurn');
    if (currentTurnMatch) return currentTurnMatch;

    let stackHasMatch = FilterMatchSubArray(s.stack.contents(),
        f.stackHas, 'stackHas');
    if (stackHasMatch) return stackHasMatch;

    let stackHeightMatch = FilterMatchLength(s.stack.contents(),
        f.StackHeight, 'stackHeight');
    if (stackHeightMatch) return stackHeightMatch;

    let filterMatchEntityPathHas = FilterMatchEntities(s,
        f.entityPathHas);
    if (filterMatchEntityPathHas) return filterMatchEntityPathHas;

    let zoneHasExact = FilterMatchZonesHas(s, f.zoneHas);
    if (zoneHasExact) return zoneHasExact;

    let zoneCount = FilterMatchZoneCount(s, f.zoneCount);
    if (zoneCount) return zoneCount;

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

export function FilterMatchEntities(state: G.IGameState,
    expected: Map<EntityCode, Map<PathString, String | number>> | undefined): String | null {

    if (!expected) return null;

    let results = new Array<String | null>();
    Array.from(expected).map(([identity, propertyMatcher]) => {
        let entity = state.entities[identity];

        results.push(FilterMatchEntity(entity, propertyMatcher));
    });

    let filtered = results.filter(v => v !== null);
    if (filtered.length === 0) return null;
    return filtered.join('\n');
}

export function FilterMatchEntity(state: any,
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

export function FilterMatchZonesHas(state: G.IGameState,
    expected: Map<ZoneCode, Array<IEntity>> | undefined): String | null {

    if (!expected) return null;
    let results = new Array<String | null>();
    expected.forEach((knownGood, zoneCode) => {
        let zone = GetZone(zoneCode, state);
        if (zone === null) {
            // Zones need to be explicitly prepared ahead of time.
            // This can be as simple as adding and removing an Entity
            // when you need an empty zone.
            throw `unknown zone ${zoneCode}`;
        }

        let asArray = zone.Ordered.map(entity => {
            if (zone === null) throw Error(`known non-null zone is null`);
            return GetEntity(entity, zone, state);
        });
        results.push(FilterMatchSubArray(asArray, knownGood, 'zoneHas'));
    });

    let filtered = results.filter(v => v !== null);
    if (filtered.length === 0) return null;
    return filtered.join('\n');
}

export function FilterMatchSubArray(state: Array<any>,
    expected: Array<any> | undefined,
    propertyName: String): String | null {

    if (expected === undefined) return null;
    if (expected.length > state.length) {
        return 'mismatched lengths on input';
    }

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

export function FilterMatchZoneCount(state: G.IGameState,
    expected: Map<ZoneCode, number> | undefined) {

    if (expected === undefined) return null;

    let byZone = Array.from(expected).map(([zoneCode, count]) => {
        let zone = GetZone(zoneCode, state);
        if (zone === null) throw Error(`unknown zone ${zoneCode}`);

        if (zone.Count !== count) {
            return `${zoneCode} mismatched length
                >>expected:
                length = ${count}
                >>got:
                length = ${zone.Count}
                zone: ${JSON.stringify(zone, null, 2)}`;
        }

        return null;
    });

    return byZone.filter(v => v != null).join('\n');
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
