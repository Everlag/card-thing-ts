import { TestCase } from '../Mutator_test';
import * as T from '../../test';
import { TargetType } from './../Header';
import Redirect,
    { IRedirectMutator, RedirectMutatorDirection } from './Redirect';

let cases: Array<TestCase> = [];

let fakeEffect = 'fake-effect';

cases.push([
    {
        Source: T.PlayerOneEntityCode,
        Targets: [T.PlayerTwoEntityCode],
        TargetType: TargetType.Player,
        Effect: fakeEffect,
    },
    {
        Mutator: Redirect.Self,
        Direction: RedirectMutatorDirection.ToSource,
    } as IRedirectMutator,
    'ToSource Redirect',
    {
        Targets: [T.PlayerOneEntityCode],
    },
]);

cases.push([
    {
        Source: T.PlayerOneEntityCode,
        Targets: [T.PlayerTwoEntityCode],
        TargetType: TargetType.Player,
        Effect: fakeEffect,
    },
    {
        Mutator: Redirect.Self,
        Direction: RedirectMutatorDirection.ToOthers,
        Others: [T.ExternalEntityCode],
    } as IRedirectMutator,
    'ToOthers Redirect',
    {
        Targets: [T.ExternalEntityCode],
    },
]);

export default cases;
