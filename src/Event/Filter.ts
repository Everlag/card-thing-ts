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
export function CheckFilter(pack: IEffectPack,
    filter: IEffectPackFilter): boolean {

    let matches = true;

    if (filter.Source && matches) {
        matches = pack.Source === filter.Source;
    }

    if (filter.Targets && matches) {
        // Any overlap of defined targets covered by the filter
        // is sufficient to match.
        matches = filter.Targets.some(t => {
            return pack.Targets.some(other => t === other);
        });
    }

    if (filter.TargetType && matches) {
        matches = pack.TargetType === filter.TargetType;
    }

    if (filter.Effect && matches) {
        matches = pack.Effect === filter.Effect;
    }

    return matches;
}
