import RNG from '../seeded_rng';

import { EntityCode } from './Header';

export function NewEntityCode(rng: RNG): EntityCode {
    let raw = rng.nextInt(0, 16777216).toString(16);
    let prefixPadLength = 6 - raw.length;
    return raw + '0'.repeat(prefixPadLength);
}
