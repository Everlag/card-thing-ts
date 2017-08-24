import * as T from '../../core/test';

import { TestCase } from './Entities_test';
import { IGameState } from '../../core/Game/Header';

import {
    IEntity,
} from '../../core/Entity/Header';

import { WithPosition } from './WithPosition';

let cases: Array<TestCase> = [];

(() => {
    let op = (state: IGameState) => {
        let e = {
            Identity: T.ExternalEntityCode,

            HasPosition: true,
            Position: 7,
        } as IEntity;

        WithPosition(e);
    };

    cases.push([
        op,
        'WithPosition - accepts valid Position',
    ]);
})();

(() => {
    let op = (state: IGameState) => {
        let e = {
            Identity: T.ExternalEntityCode,

            HasPosition: true,
            Position: 'foobar',
        } as IEntity;

        try {
            WithPosition(e);
        } catch (e) {
            return;
        }

        throw Error('invalid Position was allowed post-assertion');
    };

    cases.push([
        op,
        'WithPosition - rejects invalid Position',
    ]);
})();

export default cases;
