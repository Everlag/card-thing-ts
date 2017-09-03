import {
    IEffectDescription, IMutatorDescription, FilterMatcher,
} from '../../core/Event/Header';

import { EntityCode } from '../Entity/Header';
import { IAsInterceptor } from '../Entity/Entities/AsInterceptor';

/**
 * IRuleDependencies describes the supporting facets which must
 * be registered to allow the Rule to operate correctly.
 *
 * Failure to register these dependencies results in undefined behavior.
 */
export interface IRuleDependencies {
    Effects: Array<IEffectDescription>;
    Filters: Array<FilterMatcher>;
    Mutators: Array<IMutatorDescription>;
}

/**
 * RuleCreator generates a new Interceptor with the provided
 * identity to enforce the Rule.
 */
export type RuleCreator = (identity: EntityCode) => IAsInterceptor;

/**
 * IRuleDescription describes a rule including all dependencies.
 */
export interface IRuleDescription {
    Self: string;

    Depends: IRuleDependencies;
    Create: RuleCreator;
}