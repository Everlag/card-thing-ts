import * as F from './IFilterState';
import * as T from './test';
import {
    EntityCode,
} from './Entity/Header';
import {
    IEvent,
} from './Event/Header';

// [state, expected, testName, expectedResult = true -> null]
type TestCase = [Array<any>, Array<any>, String, boolean];

let cases = new Array<TestCase>();

cases.push([
    new Array<IEvent>(
        { Effects: [] },
    ),
    new Array<IEvent>(
        { Effects: [] },
    ),
    'empty events', true,
]);

cases.push([
    new Array<IEvent>(
        {
            Effects: [],
        },
        {
            Effects: [],
        },
    ),
    new Array<IEvent>(
        {
            Effects: [],
        },
    ),
    'expected events are subset', true,
]);

cases.push([
    new Array<IEvent>(
        {
            Effects: [],
        },
    ),
    new Array<IEvent>(
        {
            Effects: [],
        },
        {
            Effects: [],
        },
    ),
    'expected events are superset', false,
]);

cases.push([
    new Array<any>(
        {
            Effects: [
                { Targets: new Array<EntityCode>('ababab') },
            ],
        },
    ),
    new Array<any>(
        {
            Effects: [
                { Targets: new Array<EntityCode>('ababab') },
            ],
        },
    ),
    'matching targets', true,
]);

cases.push([
    new Array<any>(
        {
            Effects: [
                { Targets: new Array<EntityCode>('ababab') },
            ],
        },
    ),
    new Array<any>(
        {
            Effects: [
                { Targets: new Array<EntityCode>('cdcdcd') },
            ],
        },
    ),
    'mismatched targets', false,
]);

class FilterMatchSubArrayTest extends T.Test {
    constructor(private testCase: TestCase) {
        super();
    }

    public Run() {
        let c = this.testCase;
        let result = F.FilterMatchSubArray(c[0],
            c[1],
            c[2]);

        let expectedResult = c[3];

        let msg = null;
        if (expectedResult && result !== null) {
            msg = `failed to get expected match
                case - ${c[2]}
                state:
                \t${T.stringify(c[0])}
                expected:
                \t${T.stringify(c[1])}`;
        }
        if (!expectedResult && result === null) {
            msg = `unexpected match
                case - ${c[2]}
                state:
                \t${T.stringify(c[0])}
                expected:
                \t${T.stringify(c[1])}`;
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

const tests = cases.map(c => new FilterMatchSubArrayTest(c));
export default tests;
