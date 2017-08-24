import { TestCase } from './Zones_test';
import { IGameState } from '../../core/Game/Header';

import { MutData } from '../data';
import { PropertyEntityFromData } from '../Entities/AsProperty';
import Properties,
    {
        GetPropertyByPosition,
    } from './Properties';

let cases: Array<TestCase> = [];

(() => {
    let op = (state: IGameState) => {
        let processed = MutData().properties
            .map(p => PropertyEntityFromData(p, state));

        processed.forEach(p => {
            Properties.Add(p, state);
        });
    };

    cases.push([
        op,
        'Properties Add - accepts static data',
    ]);
})();

(() => {
    let op = (state: IGameState) => {
        let processed = MutData().properties
            .map(p => PropertyEntityFromData(p, state))
            .map(p => {
                (<any>p.Position) = undefined;
                return p;
            });

        processed.forEach(p => {
            try {
                Properties.Add(p, state);
            } catch (e) {
                return;
            }

            throw Error('invalid Position was allowed');
        });
    };

    cases.push([
        op,
        'Properties Add - rejects invalid position',
    ]);
})();

(() => {
    let op = (state: IGameState) => {
        let processed = MutData().properties
        .map(p => PropertyEntityFromData(p, state));

        processed.forEach(p => {
            Properties.Add(p, state);
        });

        let pos = 9;
        let chosenProperty = processed.find(p => p.Position === pos);
        if (chosenProperty === undefined) {
            throw Error(`properties data did not contain one with positon ${pos}`);
        }

        // Yes, this is comparing objects as they should be identical
        // addresses.
        let foundProperty = GetPropertyByPosition(pos, state);
        if (foundProperty !== chosenProperty) {
            throw Error('did not find the exact expected property');
        }
    };

    cases.push([
        op,
        'Properties GetPropertyByPosition - finds correct property',
    ]);
})();

(() => {
    let op = (state: IGameState) => {
        let processed = MutData().properties
        .map(p => PropertyEntityFromData(p, state));

        processed.forEach(p => {
            Properties.Add(p, state);
        });

        let badPosition = 900;
        let foundProperty = GetPropertyByPosition(badPosition, state);
        if (foundProperty !== null) {
            throw Error('did not receive null for unknown position');
        }
    };

    cases.push([
        op,
        'Properties GetPropertyByPosition - null on invalid position',
    ]);
})();

export default cases;
