import * as G from './Game/Game';
import * as T from './test';
import * as F from './IFilterState';
import {
    GlobalStateEntityCode,
} from './Entity/Header';
import {
    IEvent,
} from './Event/Header';
import { IAsInterceptor } from './Entity/Entities/AsInterceptor';
import Global from './Zone/Zones/Global';
import Players from './Zone/Zones/Players';
import Interceptors from './Zone/Zones/Interceptors';

// [state, expected, testName, expectedResult = true -> null]
type TestCase = [G.GameState, F.IFilterState, String, boolean];

let cases = new Array<TestCase>();

cases.push([
    new G.GameState(T.DefaultPlayers),
    {},
    'empty filter matches all',
    true,
]);

cases.push([
    new G.GameState(T.DefaultPlayers),
    {
        currentTurn: T.PlayerTwoEntityCode,
    },
    'non-matching currentTurn',
    false,
]);

cases.push([
    new G.GameState(T.DefaultPlayers),
    {
        currentTurn: T.PlayerOneEntityCode,
    },
    'matching currentTurn',
    true,
]);

let fluffContents: Array<IEvent> = [
    {
        Effects: [
            {
                Source: GlobalStateEntityCode,
                Targets: [GlobalStateEntityCode],
                TargetType: Global.TargetTypes.Global,
                Effect: 'fluff-effect',
            },
        ],
    },
];

let expectedStackContents: Array<IEvent> = [
    {
        Effects: [
            {
                Source: GlobalStateEntityCode,
                Targets: [GlobalStateEntityCode],
                TargetType: Global.TargetTypes.Global,
                Effect: 'real-effect',
            },
        ],
    },
];

(() => {
    let g = new G.GameState(T.DefaultPlayers);

    g.stack.push(...expectedStackContents);

    cases.push([
        g,
        {
            stackHas: expectedStackContents,
        },
        'matching stack subset - complete match',
        true,
    ]);
})();

(() => {
    let g = new G.GameState(T.DefaultPlayers);

    g.stack.push(...fluffContents, ...expectedStackContents);

    cases.push([
        g,
        {
            stackHas: expectedStackContents,
        },
        'matching stack subset - offset subset match',
        true,
    ]);
})();

(() => {
    cases.push([
        new G.GameState(T.DefaultPlayers),
        {
            stackHas: expectedStackContents,
        },
        'mismatching stack subset - empty state stack',
        false,
    ]);
})();

(() => {
    let g = new G.GameState(T.DefaultPlayers);

    g.stack.push(...fluffContents);

    cases.push([
        g,
        {
            stackHas: expectedStackContents,
        },
        'mismatching stack subset - non-empty state stack',
        false,
    ]);
})();

(() => {
    let g = new G.GameState(T.DefaultPlayers);

    g.stack.push(...fluffContents);

    cases.push([
        g,
        {
            StackHeight: fluffContents.length,
        },
        'matching stack height - non-empty state stack',
        true,
    ]);
})();

(() => {
    let g = new G.GameState(T.DefaultPlayers);

    cases.push([
        g,
        {
            StackHeight: 0,
        },
        'matching stack height - empty state stack',
        true,
    ]);
})();

(() => {
    let g = new G.GameState(T.DefaultPlayers);

    g.stack.push(...fluffContents);

    cases.push([
        g,
        {
            StackHeight: fluffContents.length + 1,
        },
        'mismatching stack height - non-empty state stack',
        false,
    ]);
})();

(() => {
    let g = new G.GameState(T.DefaultPlayers);

    cases.push([
        g,
        {
            StackHeight: 1,
        },
        'mismatching stack height - empty state stack',
        false,
    ]);
})();

(() => {
    let g = new G.GameState(T.DefaultPlayers);

    let expected = new Map();
    expected.set(
        T.PlayerOneEntityCode,
        new Map([
            [
                'Identity',
                T.PlayerOneEntityCode,
            ],
            [
                'Zone',
                Players.Self,
            ],
        ]),
    );

    cases.push([
        g,
        {
            entityPathHas: expected,
        },
        'matching entityPathHas - ensure own identity',
        true,
    ]);
})();

// These test cases don't fit in here terribly well as the majority
// of these tests are stack-oriented.
//
// The Effect tests are broken up into multiple, other test suites
// we should do that for each flavor of FilterState
// TODO: above
(() => {
    let g = new G.GameState(T.DefaultPlayers);

    let expected = new Map();
    expected.set(
        T.PlayerOneEntityCode,
        new Map([[
            'Identity',
            // Notice this references the second player,
            // this what causes the test failure.
            T.PlayerTwoEntityCode,
        ]]),
    );

    cases.push([
        g,
        {
            entityPathHas: expected,
        },
        'mismatching entityPathHas - ensure wrong identity',
        false,
    ]);
})();

(() => {
    let g = new G.GameState(T.DefaultPlayers);

    let expected = new Map();
    expected.set(
        T.PlayerOneEntityCode,
        new Map([[
            'DoesNotExist.apples',
            T.PlayerOneEntityCode,
        ]]),
    );

    cases.push([
        g,
        {
            entityPathHas: expected,
        },
        'mismatching entityPathHas - invalid path',
        false,
    ]);
})();

let expectedInterceptorContents: Array<IAsInterceptor> = [
    {
        IsInterceptor: true,
        Identity: T.ExternalEntityCode,
        Filter: {},
        Mutator: {
            Mutator: 'some-mutator',
        },
    } as IAsInterceptor,
];

let fluffInterceptorContents: Array<IAsInterceptor> = [
    {
        IsInterceptor: true,
        Identity: T.OtherEntityCode,
        Filter: {Null: true},
        Mutator: {
            Mutator: 'some-mutator',
        },
    } as IAsInterceptor,
];

let expectedInterceptorZoneHas = T.NewExpectedContents(Interceptors.Self,
    expectedInterceptorContents);

// forceInterceptorsZoneExistence ensures that the interceptors
// zone always exists by adding then removing from it.
//
// This is necessary as we use the Zones-internal GetZone in IFilterState
// which provides no guarantees about lazy initialization.
let forceInterceptorsZoneExistence = (g: G.GameState) => {
    // We need to force the zone to be created
    fluffInterceptorContents.forEach(i => Interceptors.Add(i, g));
    fluffInterceptorContents.forEach(i => Interceptors.Remove(i.Identity, g));

    if (Interceptors.Ordered(g).length > 0) {
        throw Error('expected empty zone is not empty');
    }
};

(() => {
    let g = new G.GameState(T.DefaultPlayers);

    expectedInterceptorContents.forEach(i => Interceptors.Add(i, g));

    cases.push([
        g,
        {
            zoneHas: expectedInterceptorZoneHas,
        },
        'matching zone subset - complete match',
        true,
    ]);
})();

(() => {
    let g = new G.GameState(T.DefaultPlayers);

    expectedInterceptorContents.forEach(i => Interceptors.Add(i, g));
    fluffInterceptorContents.forEach(i => Interceptors.Add(i, g));

    cases.push([
        g,
        {
            zoneHas: expectedInterceptorZoneHas,
        },
        'matching zone subset - offset subset match',
        true,
    ]);
})();

(() => {
    let g = new G.GameState(T.DefaultPlayers);

    // We need to force the zone to be created
    forceInterceptorsZoneExistence(g);

    cases.push([
        g,
        {
            zoneHas: expectedInterceptorZoneHas,
        },
        'mismatching zone subset - empty',
        false,
    ]);
})();

(() => {
    let g = new G.GameState(T.DefaultPlayers);

    fluffInterceptorContents.forEach(i => Interceptors.Add(i, g));

    cases.push([
        g,
        {
            zoneHas: expectedInterceptorZoneHas,
        },
        'mismatching zone subset - not present',
        false,
    ]);
})();

(() => {
    let g = new G.GameState(T.DefaultPlayers);

    forceInterceptorsZoneExistence(g);

    let expectedCount = T.NewExpectedCount(Interceptors.Self, 0);

    cases.push([
        g,
        {
            zoneCount: expectedCount,
        },
        'matching zone count - empty',
        true,
    ]);
})();

(() => {
    let g = new G.GameState(T.DefaultPlayers);

    expectedInterceptorContents.forEach(i => Interceptors.Add(i, g));

    let expectedCount = T.NewExpectedCount(Interceptors.Self,
        expectedInterceptorContents.length);

    cases.push([
        g,
        {
            zoneCount: expectedCount,
        },
        'matching zone count - some present',
        true,
    ]);
})();

(() => {
    let g = new G.GameState(T.DefaultPlayers);

    forceInterceptorsZoneExistence(g);

    let expectedCount = T.NewExpectedCount(Interceptors.Self, 10);

    cases.push([
        g,
        {
            zoneCount: expectedCount,
        },
        'mismatching zone count - empty',
        false,
    ]);
})();

(() => {
    let g = new G.GameState(T.DefaultPlayers);

    expectedInterceptorContents.forEach(i => Interceptors.Add(i, g));

    let expectedCount = T.NewExpectedCount(Interceptors.Self,
        expectedInterceptorContents.length + 1);

    cases.push([
        g,
        {
            zoneCount: expectedCount,
        },
        'mismatching zone count - some present',
        false,
    ]);
})();

class FilterMatchTest extends T.Test {
    constructor(private testCase: TestCase) {
        super();
    }

    public Run() {
        let [state, filter, name, expectedResult] = this.testCase;
        let result = F.FilterMatches(state, filter);

        let msg = null;
        if (expectedResult && result !== null) {
            msg = `failed to get expected match
                case - ${name}
                result - ${result}
                state:
                \t${T.stringify(state)}
                filter:
                \t${T.stringify(filter)}`;
        }

        if (!expectedResult && result === null) {
            msg = `unexpected match
                case - ${name}
                result - ${result}
                state:
                \t${T.stringify(state)}
                filter:
                \t${T.stringify(filter)}`;
        }

        if (msg != null) throw Error(msg);
    }
}

// Sanity check our cases before we package them up
(() => {
    let caseNames = cases.map(c => c[2]);
    let nameSet = new Set<String>(caseNames);
    if (nameSet.size !== caseNames.length) {
        throw Error('duplicated case name in IFilterState');
    }
})();

const tests = cases.map(c => new FilterMatchTest(c));
export default tests;
