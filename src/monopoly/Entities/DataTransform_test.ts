import { TestCase } from './Entities_test';
import { IGameState } from '../../core/Game/Header';

import { MutData } from '../data';
import { PropertyGroup } from './AsTile';
import { WithRent } from './WithRent';
import { WithPrice } from './WithPrice';
import { AsBuildable } from './AsBuildable';
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
                WithRent(p);
            }catch (e) {
                return;
            }

            throw Error(`special tile was accepted WithRent
                ${JSON.stringify(p)}`);
        });
    };

    cases.push([
        op,
        'TileEntityFromData - special do not satisify WithRent',
    ]);
})();

(() => {
    let op = (state: IGameState) => {
        let processed = MutData().properties
            .map(p => TileEntityFromData(p, state))
            .filter(p => p.Group !== PropertyGroup.Special);

        processed.forEach(p => {
            try {
                WithPrice(p);
            }catch (e) {
                throw Error(`non-special tile was not accepted WithPrice:
                    ${JSON.stringify(p)}
                    error: ${e.toString()}`);
            }
        });
    };

    cases.push([
        op,
        'TileEntityFromData - non-special satisfy Withprice',
    ]);
})();

(() => {
    let op = (state: IGameState) => {
        let processed = MutData().properties
            .map(p => TileEntityFromData(p, state))
            .filter(p => {
                return p.Group !== PropertyGroup.Special &&
                       p.Group !== PropertyGroup.Utilities &&
                       p.Group !==  PropertyGroup.Railroad;
            });

        processed.forEach(p => {
            try {
                AsBuildable(p);
            }catch (e) {
                throw Error(`filtered tile was not accepted AsBuildable:
                    ${JSON.stringify(p)}
                    error: ${e.toString()}`);
            }
        });
    };

    cases.push([
        op,
        'TileEntityFromData - non-(special, utility, railroad) satisfy AsBuildable',
    ]);
})();

export default cases;
