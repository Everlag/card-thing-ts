import * as T from '../../core/test';

import { TestCase } from './Entities_test';
import { IGameState } from '../../core/Game/Header';

import {
    IEntity,
} from '../../core/Entity/Header';

import { WithMoney } from './WithMoney';

let cases: Array<TestCase> = [];

(() => {
    let op = (state: IGameState) => {
        let e = {
            Identity: T.ExternalEntityCode,

            HasMoney: true,
            Money: 100,
        } as IEntity;

        WithMoney(e);
    };

    cases.push([
        op,
        'WithMoney - accepts valid',
    ]);
})();

(() => {
    let op = (state: IGameState) => {
        let e = {
            Identity: T.ExternalEntityCode,

            HasMoney: true,
            Money: 'foobar',
        } as IEntity;

        try {
            WithMoney(e);
        } catch (e) {
            return;
        }

        throw Error('invalid Money was allowed post-assertion');
    };

    cases.push([
        op,
        'WithMoney - rejects invalid money',
    ]);
})();

export default cases;
