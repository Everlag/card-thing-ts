import * as T from '../test';
import {
    CheckFilter,
} from './Filter';
import {
    TargetType, IEffectPack, Effect, IEffectPackFilter,
} from './Header';

type TestCase = [IEffectPack | null, IEffectPackFilter, String, boolean];

let cases = new Array<TestCase>();

let fakeEffect = 'fake-effect';

cases.push([
    {
        Source: T.PlayerOneEntityCode,
        Targets: [T.PlayerOneEntityCode],
        TargetType: TargetType.Player,
        Effect: fakeEffect,
    },
    {},
    'empty filter matches anything',
    true,
]);

cases.push([
    {
        Source: T.PlayerOneEntityCode,
        Targets: [T.PlayerOneEntityCode],
        TargetType: TargetType.Player,
        Effect: fakeEffect,
    },
    {
        Source: T.PlayerOneEntityCode,
    },
    'Source filter matches when correct',
    true,
]);

cases.push([
    {
        Source: T.PlayerOneEntityCode,
        Targets: [T.PlayerOneEntityCode],
        TargetType: TargetType.Player,
        Effect: fakeEffect,
    },
    {
        Source: T.PlayerTwoEntityCode,
    },
    'Source filter rejects when wrong',
    false,
]);

cases.push([
    {
        Source: T.PlayerOneEntityCode,
        Targets: [T.PlayerOneEntityCode],
        TargetType: TargetType.Player,
        Effect: fakeEffect,
    },
    {
        TargetType: TargetType.Player,
    },
    'TargetType filter matches when correct',
    true,
]);

cases.push([
    {
        Source: T.PlayerOneEntityCode,
        Targets: [T.PlayerOneEntityCode],
        TargetType: TargetType.Player,
        Effect: fakeEffect,
    },
    {
        TargetType: TargetType.Global,
    },
    'TargetType filter rejects when wrong',
    false,
]);

cases.push([
    {
        Source: T.PlayerOneEntityCode,
        Targets: [T.PlayerOneEntityCode],
        TargetType: TargetType.Player,
        Effect: fakeEffect,
    },
    {
        Effect: fakeEffect,
    },
    'Effect filter matches when correct',
    true,
]);

cases.push([
    {
        Source: T.PlayerOneEntityCode,
        Targets: [T.PlayerOneEntityCode],
        TargetType: TargetType.Player,
        Effect: fakeEffect,
    },
    {
        Effect: Effect.Damage,
    },
    'Effect filter rejects when wrong',
    false,
]);

cases.push([
    {
        Source: T.PlayerOneEntityCode,
        Targets: [T.PlayerOneEntityCode, T.PlayerTwoEntityCode],
        TargetType: TargetType.Player,
        Effect: fakeEffect,
    },
    {
        Targets: [T.PlayerOneEntityCode],
    },
    'Targets filter matches when partially covered',
    true,
]);

cases.push([
    {
        Source: T.PlayerOneEntityCode,
        Targets: [T.PlayerOneEntityCode],
        TargetType: TargetType.Player,
        Effect: fakeEffect,
    },
    {
        Targets: [T.PlayerOneEntityCode],
    },
    'Targets filter matches when entirely covered',
    true,
]);

cases.push([
    {
        Source: T.PlayerOneEntityCode,
        Targets: [T.PlayerOneEntityCode],
        TargetType: TargetType.Player,
        Effect: fakeEffect,
    },
    {
        Targets: [T.PlayerTwoEntityCode],
    },
    'Effect filter rejects when no matching targets',
    false,
]);

cases.push([
    {
        Source: T.PlayerOneEntityCode,
        Targets: [T.PlayerOneEntityCode],
        TargetType: TargetType.Player,
        Effect: fakeEffect,
    },
    {
        Targets: [T.PlayerOneEntityCode],
        Effect: fakeEffect,
    },
    'Targets + Effect filter matches when both correct',
    true,
]);

cases.push([
    {
        Source: T.PlayerOneEntityCode,
        Targets: [T.PlayerOneEntityCode],
        TargetType: TargetType.Player,
        Effect: fakeEffect,
    },
    {
        Targets: [T.PlayerTwoEntityCode],
        Effect: Effect.Damage,
    },
    'Targets + Effect filter rejects when Effect wrong',
    false,
]);

cases.push([
    null,
    {
        Null: true,
    },
    'Null filter matches when null',
    true,
]);

cases.push([
    {
        Source: T.PlayerOneEntityCode,
        Targets: [T.PlayerOneEntityCode],
        TargetType: TargetType.Player,
        Effect: fakeEffect,
    },
    {
        Null: true,
    },
    'Null filter rejects when non-null',
    false,
]);

class EffectPackFilterTest extends T.Test {
    constructor(private testCase: TestCase) {
        super();
    }

    public Run() {
        let [pack, filter, name, shouldMatch] = this.testCase;

        if (CheckFilter(pack, filter) === shouldMatch) return;

        let msg;
        if (shouldMatch) {
            msg = `failed to match when expected
            case - ${name}`;
        }else {
            msg = `unexpected match`;
        }
        msg = msg.concat('\n', `IEffectPack - ${JSON.stringify(pack)}
            Filter - ${JSON.stringify(filter)}`);

        throw Error(msg);
    }
}

// Sanity check our cases before we package them up
(() => {
    let caseNames = cases.map(c => c[2]);
    let nameSet = new Set<String>(caseNames);
    if (nameSet.size !== caseNames.length) {
        throw Error('duplicated case name in EffectPackFilterTest');
    }
})();

const tests = cases.map(c => new EffectPackFilterTest(c));
export default tests;
