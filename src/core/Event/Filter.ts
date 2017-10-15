import {
    IGameState,
} from '../Game/Header';
import {
    IEffectPack, IEffectPackFilter,
    FilterMatcher, IEffectFilterRegister,
} from './Header';

/**
 * CheckFilter determines if a given IEffectPack matches the
 * provided IEffectPackFilter.
 *
 * The strategy used here is to bypass checks once we've established
 * one falsey matcher. Hence, an empty IEffectPackFilter will always
 * be considered to match.
 */
export function CheckFilter(
    register: IEffectFilterRegister,
    pack: IEffectPack | null,
    filter: IEffectPackFilter,
    state: IGameState,
): boolean {

    // Null pack is handled here.
    // This is a special case as null is an explicit edge case.
    // We throw if we ever get an unexpected null IEffectPack.
    if (pack === null) {
        if (filter.Null) {
            return true;
        }else {
            throw Error(`unexpected null IEffectPack when filter doesn't expect`);
        }
    }
    if (filter.Null) return false;

    return register.Register.every(cb => cb(pack, filter, state));
}

let coreMatchers: IEffectFilterRegister = {
    Register: Array<FilterMatcher>(),
};

export function RegisterFilterMatcher(
    register: IEffectFilterRegister,
    matcher: FilterMatcher,
) {
    register.Register.push(matcher);
}

// What follow are our core Filter matchers required to exist
// as a result of the facets of IEffectPackFilter.
//
// These are created and registered in closures to ensure that they are
// always registerd, no copy-paste errors can arise.

(() => {
    function MatchSource(
        pack: IEffectPack, filter: IEffectPackFilter,
    ): boolean {
        if (filter.Source === undefined) return true;

        return pack.Source === filter.Source;
    }
    RegisterFilterMatcher(coreMatchers, MatchSource);
})();

(() => {
    function MatchTargets(
        pack: IEffectPack, filter: IEffectPackFilter,
    ): boolean {
        if (filter.Targets === undefined) return true;

        // Any overlap of defined targets covered by the filter
        // is sufficient to match.
        return filter.Targets.some(t => {
            return pack.Targets.some(other => t === other);
        });
    }
    RegisterFilterMatcher(coreMatchers, MatchTargets);
})();

(() => {
    function MatchTargetType(
        pack: IEffectPack, filter: IEffectPackFilter,
    ): boolean {
        if (filter.TargetType === undefined) return true;

        return pack.TargetType === filter.TargetType;
    }
    RegisterFilterMatcher(coreMatchers, MatchTargetType);
})();

(() => {
    function MatchEffect(
        pack: IEffectPack, filter: IEffectPackFilter,
    ): boolean {
        if (filter.Effect === undefined) return true;

        return pack.Effect === filter.Effect;
    }
    RegisterFilterMatcher(coreMatchers, MatchEffect);
})();

/**
 * NewFilterMatcherRegister constructs an EffectFilterRegister with all
 * core matchers already registered.
 */
export function NewFilterMatcherRegister(): IEffectFilterRegister {
    let register: IEffectFilterRegister = {
        Register: new Array<FilterMatcher>(),
    };

    // Trivial copy with identity
    register.Register = coreMatchers.Register.map(v => v);

    return register;
}
