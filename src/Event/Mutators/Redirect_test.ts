import { TestCase } from '../Mutator_test';
import * as T from '../../test';
import Players from '../../Zone/Zones/Players';
import Redirect,
    { IRedirectMutator, RedirectMutatorDirection } from './Redirect';

let cases: Array<TestCase> = [];

let fakeEffect = 'fake-effect';

cases.push([
    {
        Source: T.PlayerOneEntityCode,
        Targets: [T.PlayerTwoEntityCode],
        TargetType: Players.TargetTypes.Player,
        Effect: fakeEffect,
    },
    {
        Mutator: Redirect.Self,
        Direction: RedirectMutatorDirection.ToSource,
    } as IRedirectMutator,
    'ToSource Redirect',
    [
        {
            Targets: [T.PlayerOneEntityCode],
        },
    ],
]);

cases.push([
    {
        Source: T.PlayerOneEntityCode,
        Targets: [T.PlayerTwoEntityCode],
        TargetType: Players.TargetTypes.Player,
        Effect: fakeEffect,
    },
    {
        Mutator: Redirect.Self,
        Direction: RedirectMutatorDirection.ToOthers,
        Others: [T.ExternalEntityCode],
    } as IRedirectMutator,
    'ToOthers Redirect',
    [
        {
            Targets: [T.ExternalEntityCode],
        },
    ],
]);

export default cases;
