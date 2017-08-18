import * as G from './Game/Game';
import * as T from './test';
import * as F from './IFilterState';
import {
    GlobalStateEntityCode,
} from './Entity/Header';
import {
    IEvent, TargetType,
} from './Event/Header';
import { IAsInterceptor } from './Entity/Entities/AsInterceptor';

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
                TargetType: TargetType.Global,
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
                TargetType: TargetType.Global,
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
        new Map([[
            'Identity',
            T.PlayerOneEntityCode,
        ]]),
    );

    cases.push([
        g,
        {
            playerHas: expected,
        },
        'matching playerHas - ensure own identity',
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
            playerHas: expected,
        },
        'mismatching playerHas - ensure wrong identity',
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
            playerHas: expected,
        },
        'mismatching playerHas - invalid path',
        false,
    ]);
})();

let expectedInterceptorContents: Array<IAsInterceptor> = [
    {
        Identity: T.ExternalEntityCode,
        Filter: {},
        Mutator: {
            Mutator: 'some-mutator',
        },
    } as IAsInterceptor,
];

let fluffInterceptorContents: Array<IAsInterceptor> = [
    {
        Identity: T.ExternalEntityCode,
        Filter: {Null: true},
        Mutator: {
            Mutator: 'some-mutator',
        },
    } as IAsInterceptor,
];

(() => {
    let g = new G.GameState(T.DefaultPlayers);

    g.interceptors.push(...expectedInterceptorContents);

    cases.push([
        g,
        {
            interceptsHas: expectedInterceptorContents,
        },
        'matching intercept subset - complete match',
        true,
    ]);
})();

(() => {
    let g = new G.GameState(T.DefaultPlayers);

    g.interceptors.push(...expectedInterceptorContents);
    g.interceptors.push(...fluffInterceptorContents);

    cases.push([
        g,
        {
            interceptsHas: expectedInterceptorContents,
        },
        'matching intercept subset - offset subset match',
        true,
    ]);
})();

(() => {
    let g = new G.GameState(T.DefaultPlayers);

    cases.push([
        g,
        {
            interceptsHas: expectedInterceptorContents,
        },
        'mismatching intercept subset - empty',
        false,
    ]);
})();

(() => {
    let g = new G.GameState(T.DefaultPlayers);

    g.interceptors.push(...fluffInterceptorContents);

    cases.push([
        g,
        {
            interceptsHas: expectedInterceptorContents,
        },
        'mismatching intercept subset - not present',
        false,
    ]);
})();

(() => {
    let g = new G.GameState(T.DefaultPlayers);

    cases.push([
        g,
        {
            interceptCount: 0,
        },
        'matching intercept count - empty',
        true,
    ]);
})();

(() => {
    let g = new G.GameState(T.DefaultPlayers);

    g.interceptors.push(...expectedInterceptorContents);

    cases.push([
        g,
        {
            interceptCount: expectedInterceptorContents.length,
        },
        'matching intercept count - some present',
        true,
    ]);
})();

(() => {
    let g = new G.GameState(T.DefaultPlayers);

    cases.push([
        g,
        {
            interceptCount: 10,
        },
        'mismatching intercept count - empty',
        false,
    ]);
})();

(() => {
    let g = new G.GameState(T.DefaultPlayers);

    g.interceptors.push(...expectedInterceptorContents);

    cases.push([
        g,
        {
            interceptCount: expectedInterceptorContents.length + 1,
        },
        'mismatching intercept count - some present',
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
                state:
                \t${T.stringify(state)}
                filter:
                \t${T.stringify(filter)}`;
        }

        if (!expectedResult && result === null) {
            msg = `unexpected match
                case - ${name}
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
