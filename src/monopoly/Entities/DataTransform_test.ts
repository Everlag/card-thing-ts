import { TestCase } from './Entities_test';
import { IGameState } from '../../core/Game/Header';

import { MutData } from '../data';
import { PropertyGroup } from './AsTile';
import { AsProperty } from './AsProperty';
import { TileEntityFromData } from './DataTransform';

let cases: Array<TestCase> = [];

(() => {
    let op = (state: IGameState) => {
        let processed = MutData().properties
            .map(p => TileEntityFromData(p, state));

        processed.forEach(p => {
            // Test a few key properties to ensure they were translated
            if (!p.Identity.length ||
                p.Identity.length < 0) {
                throw Error(`tile not assigned EntityCode`);
            }
            if (!p.Name.length ||
                p.Name.length < 0) {
                throw Error(`tile name not translated`);
            }
        });
    };

    cases.push([
        op,
        'TileEntityFromData - basic fields populated',
    ]);
})();

(() => {
    let op = (state: IGameState) => {
        let processed = MutData().properties
            .map(p => TileEntityFromData(p, state))
            .filter(p => p.Group === PropertyGroup.Special);

        processed.forEach(p => {
            try {
                AsProperty(p);
            }catch (e) {
                return;
            }

            throw Error(`special tile was accepted as property
                ${JSON.stringify(p)}`);
        });
    };

    cases.push([
        op,
        'TileEntityFromData - special are not property',
    ]);
})();

(() => {
    let op = (state: IGameState) => {
        let processed = MutData().properties
            .map(p => TileEntityFromData(p, state))
            .filter(p => p.Group !== PropertyGroup.Special);

        processed.forEach(p => {
            try {
                AsProperty(p);
            }catch (e) {
                throw Error(`non-special tile was not accepted as property:
                    ${JSON.stringify(p)}
                    error: ${e.toString()}`);
            }
        });
    };

    cases.push([
        op,
        'TileEntityFromData - non-special are property',
    ]);
})();

export default cases;
