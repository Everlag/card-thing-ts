import * as T from './test';

import * as filter_array_match_test from './IFilterStateArrayMatch_test';
import * as filter_test from './IFilterState_test';
import * as entity_code_test from './Entity/EntityCode_test';
import * as effect_test from './Event/Effect_test';
import * as zone_test from './Zone/Zone_test';

let tests = new Array<T.Test>();

class EndTurnTest extends T.Test {
    public Run() {
        return;
    }
}

tests.push(...[
    new EndTurnTest(),
    ...entity_code_test.default,
    ...filter_array_match_test.default,
    ...filter_test.default,
    ...effect_test.default,
    ...zone_test.default,
]);

export function RunAll() {
    // [succes, TestName, Error?]
    type TestResult = [boolean, String, any];

    let start = performance.now();

    let results = tests.map((t): TestResult => {
        try {
            t.Run();
        } catch (e) {
            return [false, t.Name(), e];
        }
        return [true, t.Name(), null];
    });

    let end = performance.now();
    console.log(`tests took ${end - start}ms to run`);

    let failed = results.filter(r => !r[0]);

    let successCount = results.length - failed.length;

    if (failed.length === 0) {
        console.log(`all ${successCount} tests passed`);
        return;
    }

    console.warn(`${failed.length} failed, ${successCount} succeded`);

    failed.forEach(r => {
        console.error(`-- ${r[1]} - `, r[2]);
    });

}
