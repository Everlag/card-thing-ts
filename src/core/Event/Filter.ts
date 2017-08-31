import {
    IEffectPack, IEffectPackFilter,
} from './Header';

/**
 * CheckFilter determines if a given IEffectPack matches the
 * provided IEffectPackFilter.
 *
 * The strategy used here is to bypass checks once we've established
 * one falsey matcher. Hence, an empty IEffectPackFilter will always
 * be considered to match.
 */
export function CheckFilter(pack: IEffectPack | null,
    filter: IEffectPackFilter): boolean {

    let matches = true;

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

    let matchers: Array<FilterMatcher> = [
        MatchSource, MatchTargets, MatchTargetType, MatchEffect,
    ];

    matches = matchers.every(cb => cb(pack, filter));

    return matches;
}

/**
 * A FilterMatcher must behave as follows:
 * - When not requested by the provided filter, return true.
 * - When requested by the filter, evaluates its condition.
 *
 * A FilterMatcher should determine when it has been requested
 * by its property being non-undefined. A FilterMatcher should
 * only ever operate against a single property of the Filter.
 */
export type FilterMatcher = (
    pack: IEffectPack, filter: IEffectPackFilter,
) => boolean;

function MatchSource(
    pack: IEffectPack, filter: IEffectPackFilter,
): boolean {
    if (filter.Source === undefined) return true;

    return pack.Source === filter.Source;
}

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

function MatchTargetType(
    pack: IEffectPack, filter: IEffectPackFilter,
): boolean {
    if (filter.TargetType === undefined) return true;

    return pack.TargetType === filter.TargetType;
}

function MatchEffect(
    pack: IEffectPack, filter: IEffectPackFilter,
): boolean {
    if (filter.Effect === undefined) return true;

    return pack.Effect === filter.Effect;
}
