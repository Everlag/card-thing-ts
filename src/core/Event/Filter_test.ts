import * as T from '../test';
import {
    CheckFilter, NewFilterMatcherRegister, RegisterFilterMatcher,
} from './Filter';
import {
    IEffectPack, IEffectPackFilter, FilterMatcher,
} from './Header';
import { IGameState } from '../Game/Header';
import { GameState } from '../Game/Game';
import Players from '../Zone/Zones/Players';
import Global from '../Zone/Zones/Global';

export type TestCase =
    [IEffectPack | null, IGameState | null, IEffectPackFilter,
    String, boolean, FilterMatcher | undefined];

let cases = new Array<TestCase>();

const fakeEffect = 'fake-effect';
const wrongEffect = 'wrong-effect';

cases.push([
    {
        Source: T.PlayerOneEntityCode,
        Targets: [T.PlayerOneEntityCode],
        TargetType: Players.TargetTypes.Player,
        Effect: fakeEffect,
    },
    null,
    {},
    'empty filter matches anything',
    true,
    undefined, // Core FilterMatcher doesn't need to be registered
]);

cases.push([
    {
        Source: T.PlayerOneEntityCode,
        Targets: [T.PlayerOneEntityCode],
        TargetType: Players.TargetTypes.Player,
        Effect: fakeEffect,
    },
    null,
    {
        Source: T.PlayerOneEntityCode,
    },
    'Source filter matches when correct',
    true,
    undefined,
]);

cases.push([
    {
        Source: T.PlayerOneEntityCode,
        Targets: [T.PlayerOneEntityCode],
        TargetType: Players.TargetTypes.Player,
        Effect: fakeEffect,
    },
    null,
    {
        Source: T.PlayerTwoEntityCode,
    },
    'Source filter rejects when wrong',
    false,
    undefined,
]);

cases.push([
    {
        Source: T.PlayerOneEntityCode,
        Targets: [T.PlayerOneEntityCode],
        TargetType: Players.TargetTypes.Player,
        Effect: fakeEffect,
    },
    null,
    {
        TargetType: Players.TargetTypes.Player,
    },
    'TargetType filter matches when correct',
    true,
    undefined,
]);

cases.push([
    {
        Source: T.PlayerOneEntityCode,
        Targets: [T.PlayerOneEntityCode],
        TargetType: Players.TargetTypes.Player,
        Effect: fakeEffect,
    },
    null,
    {
        TargetType: Global.TargetTypes.Global,
    },
    'TargetType filter rejects when wrong',
    false,
    undefined,
]);

cases.push([
    {
        Source: T.PlayerOneEntityCode,
        Targets: [T.PlayerOneEntityCode],
        TargetType: Players.TargetTypes.Player,
        Effect: fakeEffect,
    },
    null,
    {
        Effect: fakeEffect,
    },
    'Effect filter matches when correct',
    true,
    undefined,
]);

cases.push([
    {
        Source: T.PlayerOneEntityCode,
        Targets: [T.PlayerOneEntityCode],
        TargetType: Players.TargetTypes.Player,
        Effect: fakeEffect,
    },
    null,
    {
        Effect: wrongEffect,
    },
    'Effect filter rejects when wrong',
    false,
    undefined,
]);

cases.push([
    {
        Source: T.PlayerOneEntityCode,
        Targets: [T.PlayerOneEntityCode, T.PlayerTwoEntityCode],
        TargetType: Players.TargetTypes.Player,
        Effect: fakeEffect,
    },
    null,
    {
        Targets: [T.PlayerOneEntityCode],
    },
    'Targets filter matches when partially covered',
    true,
    undefined,
]);

cases.push([
    {
        Source: T.PlayerOneEntityCode,
        Targets: [T.PlayerOneEntityCode],
        TargetType: Players.TargetTypes.Player,
        Effect: fakeEffect,
    },
    null,
    {
        Targets: [T.PlayerOneEntityCode],
    },
    'Targets filter matches when entirely covered',
    true,
    undefined,
]);

cases.push([
    {
        Source: T.PlayerOneEntityCode,
        Targets: [T.PlayerOneEntityCode],
        TargetType: Players.TargetTypes.Player,
        Effect: fakeEffect,
    },
    null,
    {
        Targets: [T.PlayerTwoEntityCode],
    },
    'Effect filter rejects when no matching targets',
    false,
    undefined,
]);

cases.push([
    {
        Source: T.PlayerOneEntityCode,
        Targets: [T.PlayerOneEntityCode],
        TargetType: Players.TargetTypes.Player,
        Effect: fakeEffect,
    },
    null,
    {
        Targets: [T.PlayerOneEntityCode],
        Effect: fakeEffect,
    },
    'Targets + Effect filter matches when both correct',
    true,
    undefined,
]);

cases.push([
    {
        Source: T.PlayerOneEntityCode,
        Targets: [T.PlayerOneEntityCode],
        TargetType: Players.TargetTypes.Player,
        Effect: fakeEffect,
    },
    null,
    {
        Targets: [T.PlayerTwoEntityCode],
        Effect: wrongEffect,
    },
    'Targets + Effect filter rejects when Effect wrong',
    false,
    undefined,
]);

cases.push([
    null,
    null,
    {
        Null: true,
    },
    'Null filter matches when null',
    true,
    undefined,
]);

cases.push([
    {
        Source: T.PlayerOneEntityCode,
        Targets: [T.PlayerOneEntityCode],
        TargetType: Players.TargetTypes.Player,
        Effect: fakeEffect,
    },
    null,
    {
        Null: true,
    },
    'Null filter rejects when non-null',
    false,
    undefined,
]);

export class EffectPackFilterTest extends T.Test {
    constructor(private testCase: TestCase) {
        super();
    }

    public Run() {
        let [
            pack, state, filter,
            name, shouldMatch, toRegister,
        ] = this.testCase;

        let register = NewFilterMatcherRegister();
        if (toRegister !== undefined) {
            RegisterFilterMatcher(register, toRegister);
        }
        if (state === null) state = new GameState(T.DefaultPlayers);
        if (CheckFilter(register, pack, filter, state) === shouldMatch) return;

        let msg;
        if (shouldMatch) {
            msg = `failed to match when expected`;
        }else {
            msg = `unexpected match`;
        }
        msg = `${msg}
            case - ${name}`;
        msg = msg.concat('\n', `IEffectPack - ${JSON.stringify(pack)}
            Filter - ${JSON.stringify(filter)}`);

        throw Error(msg);
    }
}

// Sanity check our cases before we package them up
(() => {
    let caseNames = cases.map(c => c[3]);
    let nameSet = new Set<String>(caseNames);
    if (nameSet.size !== caseNames.length) {
        throw Error('duplicated case name in EffectPackFilterTest');
    }
})();

const tests = cases.map(c => new EffectPackFilterTest(c));
export default tests;
