import * as T from '../../core/test';

import { TestCase } from './Entities_test';
import { IGameState } from '../../core/Game/Header';

import {
    IEntity, GlobalStateEntityCode,
} from '../../core/Entity/Header';

import { WithOwner } from './WithOwner';

let cases: Array<TestCase> = [];

(() => {
    let op = (state: IGameState) => {
        let e = {
            Identity: T.ExternalEntityCode,

            HasOwner: true,
            Owner: GlobalStateEntityCode,
        } as IEntity;

        WithOwner(e);
    };

    cases.push([
        op,
        'WithOwner - accepts valid',
    ]);
})();

(() => {
    let op = (state: IGameState) => {
        let e = {
            Identity: T.ExternalEntityCode,

            HasOwner: true,
            Owner: '',
        } as IEntity;

        try {
            WithOwner(e);
        } catch (e) {
            return;
        }

        throw Error('invalid Owner was allowed post-assertion');
    };

    cases.push([
        op,
        'WithOwner - rejects invalid owner',
    ]);
})();

export default cases;
