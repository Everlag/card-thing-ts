import * as T from '../../core/test';

import { TestCase } from './Entities_test';
import { IGameState } from '../../core/Game/Header';

import {
    IEntity,
} from '../../core/Entity/Header';

import { WithPrice } from './WithPrice';

let cases: Array<TestCase> = [];

(() => {
    let op = (state: IGameState) => {
        let e = {
            Identity: T.ExternalEntityCode,

            HasPrice: true,
            BasePrice: 50,
        } as IEntity;

        WithPrice(e);
    };

    cases.push([
        op,
        'WithPrice - accepts valid',
    ]);
})();

(() => {
    let op = (state: IGameState) => {
        let e = {
            Identity: T.ExternalEntityCode,

            HasPrice: true,
            BasePrice: 'foobar',
        } as IEntity;

        try {
            WithPrice(e);
        } catch (e) {
            return;
        }

        throw Error('invalid BasePrice was allowed post-assertion');
    };

    cases.push([
        op,
        'WithPrice - rejects invalid price',
    ]);
})();

export default cases;
