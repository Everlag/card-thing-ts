import * as T from '../../core/test';

import { TestCase } from './Entities_test';
import { IGameState } from '../../core/Game/Header';

import {
    IEntity,
} from '../../core/Entity/Header';

import { WithRent } from './WithRent';

let cases: Array<TestCase> = [];

(() => {
    let op = (state: IGameState) => {
        let e = {
            Identity: T.ExternalEntityCode,

            HasRent: true,
            BaseRent: 50,
        } as IEntity;

        WithRent(e);
    };

    cases.push([
        op,
        'WithRent - accepts valid',
    ]);
})();

(() => {
    let op = (state: IGameState) => {
        let e = {
            Identity: T.ExternalEntityCode,

            HasRent: true,
            BaseRent: 'foobar',
        } as IEntity;

        try {
            WithRent(e);
        } catch (e) {
            return;
        }

        throw Error('invalid BaseRent was allowed post-assertion');
    };

    cases.push([
        op,
        'WithRent - rejects invalid rent',
    ]);
})();

export default cases;
