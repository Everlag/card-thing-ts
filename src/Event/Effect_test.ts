import SingleEffect_test from './SingleEffect_test';
import MultiEffect_test from './MultiEffect_test';
import AssertEffect_test from './AssertEffect_test';

let tests = [
    ...SingleEffect_test,
    ...MultiEffect_test,
    ...AssertEffect_test,
];

export default tests;
