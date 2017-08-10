import RNG from '../seeded_rng';
import { EntityCode } from './Header';
import { NewEntityCode } from './EntityCode';

import * as T from '../test';

class EntityCodeTest extends T.Test {
    public Run() {
        let seed = 2;
        let rng = new RNG(seed);

        let codeCount = 10;

        let codes = new Set<EntityCode>();
        for (let i = 0; i < codeCount; i++) {
            let code = NewEntityCode(rng);
            T.ExpectToEqual(6, code.length, 'EntityCode wrong length');
            codes.add(code);
        }

        T.ExpectToEqual(codeCount, codes.size,
            'unexpcted number of EntityCodes present');

        return;
    }
}

const tests = [new EntityCodeTest()];
export default tests;
