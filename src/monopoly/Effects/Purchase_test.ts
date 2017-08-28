import { TestCase } from './SingleEffect_test';
import * as T from '../../core/test';

import { GetPreparedGameState } from '../helpers_test';

import Players from '../../core/Zone/Zones/Players';
import Tiles from '../Zones/Tiles';

import { AsTile, PropertyGroup } from '../Entities/AsTile';
import { WithMoney } from '../Entities/WithMoney';
import { WithPrice } from '../Entities/WithPrice';

import Purchase, { NewPurchaseTileEvent } from './Purchase';

let cases: Array<TestCase> = [];

(() => {
    let state = GetPreparedGameState();
    let purchasable = Tiles.Ordered(state).filter(t => {
        let tile = AsTile(Tiles.Get(t, state));
        return tile.Group !== PropertyGroup.Special;
    });
    if (purchasable.length === 0) throw Error('no non-special tiles available');
    let tile = purchasable[0];

    let event = NewPurchaseTileEvent(T.PlayerOneEntityCode, tile);
    if (event.Effects.length < 1) throw Error(`NewPurchaseTileEvent gave 0 effects`);

    let player = Players.Get(T.PlayerOneEntityCode, state);
    WithMoney(player).Money = 1 + WithPrice(Tiles.Get(tile, state)).BasePrice;

    let expected = new Map();
    expected.set(
        tile,
        new Map<any, any>([
            [
                'Zone',
                Tiles.Self,
            ],
            [
                'Owner',
                T.PlayerOneEntityCode,
            ],
        ]),
    );

    expected.set(
        T.PlayerOneEntityCode,
        new Map<any, any>([
            [
                'Zone',
                Players.Self,
            ],
            [
                'Money',
                1,
            ],
        ]),
    );

    cases.push([
        state,
        event.Effects[0],
        'Purchase tile - exactly one dollar leftover',
        {
            entityPathHas: expected,
        },
        Purchase,
    ]);
})();

export default cases;
