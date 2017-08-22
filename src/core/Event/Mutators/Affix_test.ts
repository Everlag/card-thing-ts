import { TestCase } from '../Mutator_test';
import * as T from '../../test';
import { IEffectPack, IEffectPackFilter } from './../Header';
import Players from '../../Zone/Zones/Players';
import Affix,
    { AffixMutatorPlacment, IAffixMutator } from './Affix';

let cases: Array<TestCase> = [];

let fakeEffect = 'fake-effect';

let toAffix = {
        Source: T.ExternalEntityCode,
        Targets: [T.ExternalEntityCode],
        TargetType: Players.TargetTypes.Player,
        Effect: fakeEffect,
    } as IEffectPack;

let toAffixFilter = {
        Source: toAffix.Source,
        Targets: toAffix.Targets,
        TargetType: toAffix.TargetType,
        Effect: toAffix.Effect,
    } as IEffectPackFilter;

cases.push([
    {
        Source: T.PlayerOneEntityCode,
        Targets: [T.PlayerTwoEntityCode],
        TargetType: Players.TargetTypes.Player,
        Effect: fakeEffect,
    },
    {
        Mutator: Affix.Self,
        Placement: AffixMutatorPlacment.Before,
        Others: [
            toAffix,
        ],
    } as IAffixMutator,
    'Before Affix',
    [
        // Added effect is prepended
        toAffixFilter,
        // Original effect remains unchanged, validate that
        {
            Source: T.PlayerOneEntityCode,
            Targets: [T.PlayerTwoEntityCode],
            TargetType: Players.TargetTypes.Player,
            Effect: fakeEffect,
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
        Mutator: Affix.Self,
        Placement: AffixMutatorPlacment.After,
        Others: [
            toAffix,
        ],
    } as IAffixMutator,
    'After Affix',
    [
        // Original effect remains unchanged, validate that
        {
            Source: T.PlayerOneEntityCode,
            Targets: [T.PlayerTwoEntityCode],
            TargetType: Players.TargetTypes.Player,
            Effect: fakeEffect,
        },
        // Added effect is appended
        toAffixFilter,
    ],
]);

export default cases;
