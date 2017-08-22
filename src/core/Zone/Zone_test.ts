import {
    GameState,
} from '../Game/Game';
import * as T from '../test';
import {
    FindEntity, NewZoneRegister,
} from './Zone';
import {
    GetZone,
    AddEntity,
    LazyZoneInit,
} from './Internal';
import {
    ZoneCode, TargetType,
} from './Header';
import {
    IEntity, EntityAssertError,
} from '../Entity/Header';

export type TestCase =
    [IEntity, ZoneCode, TargetType,
    String,
    'add' | 'find',
    boolean];

export const Cases = new Array<TestCase>();

import Players_test from './Zones/Players_test';
Cases.push(...Players_test);

class ZoneTest extends T.Test {
    constructor(private testCase: TestCase) {
        super();
    }

    public Run() {
        let [entity, zone, targetType,
            name, operation, doesThrow] = this.testCase;

        let state = new GameState(T.GetDefaultPlayers());

        let zoneRegister = NewZoneRegister();

        let desc = zoneRegister.Zones.get(zone);
        if (desc === undefined) throw Error(`unknown zone ${zone}`);
        let z = LazyZoneInit(GetZone(zone, state), desc.New, state);

        let didThrow = false;
        try {
            switch (operation) {
                case 'add':
                    desc.Add(entity, state);
                    break;
                case 'find':
                    // Unsafely add it prior to Finding it
                    AddEntity(entity, z, state);
                    FindEntity(zoneRegister,
                        entity.Identity, targetType, state);
                    break;
                default:
                    throw Error('fell through exhaustive operation switch');
            }
        }catch (thrown) {
            // All thrown errors must be EntityAssertion errors
            if (!(thrown instanceof EntityAssertError)) {
                throw Error(`non-EntityAssertError error received ${thrown.toString()}`);
            }

            didThrow = true;
        }

        // I prefer the separate ifs here. Simpler boolean expression.
        if (doesThrow && didThrow) return;
        if (!doesThrow && !didThrow) return;

        let msg = ``;
        if (doesThrow && !didThrow) {
            msg = `did not throw when expected`;
        }
        if (!doesThrow && didThrow) {
            msg = `threw when unexpected`;
        }

        msg = `${msg}
                case - ${name}`;

        throw Error(msg);
    }
}

// Sanity check our cases before we package them up
(() => {
    let caseNames = Cases.map(c => c[3]);
    let nameSet = new Set<String>(caseNames);
    if (nameSet.size !== caseNames.length) {
        throw Error('duplicated case name in Zone');
    }
})();

const tests = Cases.map(c => new ZoneTest(c));
export default tests;
