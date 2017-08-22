import { TestCase } from '../Mutator_test';
import * as T from '../../test';
import Players from '../../Zone/Zones/Players';
import Cancel from './Cancel';

let cases: Array<TestCase> = [];

let fakeEffect = 'fake-effect';

cases.push([
    {
        Source: T.PlayerOneEntityCode,
        Targets: [T.PlayerOneEntityCode],
        TargetType: Players.TargetTypes.Player,
        Effect: fakeEffect,
    },
    {
        Mutator: Cancel.Self,
    },
    'Cancel results in Null value',
    [
        {
            Null: true,
        },
    ],
]);

export default cases;
