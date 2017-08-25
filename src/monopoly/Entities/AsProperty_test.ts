import { TestCase } from './Entities_test';
import { IGameState } from '../../core/Game/Header';

import { MutData } from '../data';
import { TileEntityFromData } from './DataTransform';
import { PropertyGroup } from './AsTile';
import { AsProperty } from './AsProperty';

let cases: Array<TestCase> = [];

(() => {
    let op = (state: IGameState) => {
        let processed = MutData().properties
            .map(p => TileEntityFromData(p, state))
            .filter(p => p.Group !== PropertyGroup.Special);

        processed.forEach(p => {
            // Reassert
            AsProperty(p);

            // Test a few key properties to ensure they were translated
            if (!p.Identity.length ||
                p.Identity.length < 0) {
                throw Error(`property not assigned EntityCode`);
            }
            if (!p.Name.length ||
                p.Name.length < 0) {
                throw Error(`property name not translated`);
            }
        });
    };

    cases.push([
        op,
        'AsProperty PropertyEntityFromData - static data',
    ]);
})();

(() => {
    let op = (state: IGameState) => {
        let processed = MutData().properties
            .map(p => TileEntityFromData(p, state))
            .map(p => {
                (<any>p.Position) = undefined;
                return p;
            });

        processed.forEach(p => {
            try {
                // Reassert
                AsProperty(p);
            } catch (e) {
                return;
            }

            throw Error('invalid Position was allowed');
        });
    };

    cases.push([
        op,
        'AsProperty PropertyEntityFromData - validates Position',
    ]);
})();

export default cases;
