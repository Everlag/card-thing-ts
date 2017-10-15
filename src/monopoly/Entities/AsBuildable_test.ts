import * as T from '../../core/test';

import { TestCase } from './Entities_test';
import { IGameState } from '../../core/Game/Header';

import {
    IEntity,
} from '../../core/Entity/Header';

import { AsBuildable } from './AsBuildable';

let cases: Array<TestCase> = [];

(() => {
    let op = (state: IGameState) => {
        let e = {
            Identity: T.ExternalEntityCode,

            IsBuildable: true,
            BaseHouseCost: 50,
            HouseCount: 1,
        } as IEntity;

        AsBuildable(e);
    };

    cases.push([
        op,
        'AsBuildable - accepts valid',
    ]);
})();

(() => {
    let op = (state: IGameState) => {
        let e = {
            Identity: T.ExternalEntityCode,

            IsBuildable: true,
            BaseHouseCost: 'foobar',
            HouseCount: 1,
        } as IEntity;

        try {
            AsBuildable(e);
        } catch (e) {
            return;
        }

        throw Error('invalid BasePrice was allowed post-assertion');
    };

    cases.push([
        op,
        'AsBuildable - rejects invalid BaseHouseCost',
    ]);
})();

(() => {
    let op = (state: IGameState) => {
        let e = {
            Identity: T.ExternalEntityCode,

            IsBuildable: true,
            BaseHouseCost: 50,
            HouseCount: 'foobar',
        } as IEntity;

        try {
            AsBuildable(e);
        } catch (e) {
            return;
        }

        throw Error('invalid BasePrice was allowed post-assertion');
    };

    cases.push([
        op,
        'AsBuildable - rejects invalid HouseCount',
    ]);
})();

export default cases;
