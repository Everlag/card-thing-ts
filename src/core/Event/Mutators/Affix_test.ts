import { TestCase } from '../Mutator_test';
import * as T from '../../test';
import { IEffectPack, IEffectPackFilter } from './../Header';
import Players from '../../Zone/Zones/Players';
import Affix,
    {
        AffixMutatorPlacment,
        IAffixMutator,
        IAffixReplaceEffectPack,
    } from './Affix';

let cases: Array<TestCase> = [];

let fakeEffect = 'fake-effect';

let sourceEffect = {
    Source: T.PlayerOneEntityCode,
    Targets: [T.PlayerTwoEntityCode],
    TargetType: Players.TargetTypes.Player,
    Effect: fakeEffect,
};

(() => {
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
        sourceEffect,
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
        sourceEffect,
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
})();

(() => {

    let toAffixAndReplace = {
        Source: '$ToReplace$',
        Targets: [T.ExternalEntityCode],
        TargetType: Players.TargetTypes.Player,
        Effect: fakeEffect,

        Replacements: [
            'Source',
        ],
    } as IAffixReplaceEffectPack;

    let toAffixAndReplaceFilter = {
        Source: sourceEffect.Source,
    } as IEffectPackFilter;

    cases.push([
        sourceEffect,
        {
            Mutator: Affix.Self,
            Placement: AffixMutatorPlacment.Before,
            Others: [
                toAffixAndReplace,
            ],
        } as IAffixMutator,
        'Before Replacement Affix',
        [
            toAffixAndReplaceFilter,
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
        sourceEffect,
        {
            Mutator: Affix.Self,
            Placement: AffixMutatorPlacment.After,
            Others: [
                toAffixAndReplace,
            ],
        } as IAffixMutator,
        'After Replacement Affix',
        [
            // Original effect remains unchanged, validate that
            {
                Source: T.PlayerOneEntityCode,
                Targets: [T.PlayerTwoEntityCode],
                TargetType: Players.TargetTypes.Player,
                Effect: fakeEffect,
            },
            // Added effect is appended
            toAffixAndReplaceFilter,
        ],
    ]);

})();

export default cases;
