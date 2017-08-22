import * as T from '../core/test';
// import * as zone_test from './Zone/Zone_test';

let tests = new Array<T.Test>();

tests.push(...[

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
        console.error(`-- ${r[1]} - ${r[2]}`);
    });

}
