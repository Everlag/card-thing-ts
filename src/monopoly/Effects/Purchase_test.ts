import { TestCase } from './SingleEffect_test';
import * as T from '../../core/test';

import { GlobalStateEntityCode } from '../../core/Entity/Header';

import { GetPreparedGameState } from '../helpers_test';
import Tiles from '../Zones/Tiles';
import Players from '../../core/Zone/Zones/Players';

import { WithPrice } from '../Entities/WithPrice';
import { WithMoney } from '../Entities/WithMoney';
import { AsTile, PropertyGroup } from '../Entities/AsTile';

import Purchase, { NewPurchaseTileEvent } from './Purchase';
import { NewPayEntityEvent } from './Pay';

let cases: Array<TestCase> = [];

(() => {
    let state = GetPreparedGameState();
    let purchasable = Tiles.Ordered(state).filter(t => {
        let tile = AsTile(Tiles.Get(t, state));
        return tile.Group !== PropertyGroup.Special;
    });
    if (purchasable.length === 0) throw Error('no non-special tiles available');
    let tile = purchasable[0];

    let player = Players.Get(T.PlayerOneEntityCode, state);
    WithMoney(player).Money = 1 + WithPrice(Tiles.Get(tile, state)).BasePrice;

    let event = NewPurchaseTileEvent(T.PlayerOneEntityCode, tile);
    if (event.Effects.length < 1) throw Error(`NewPurchaseTileEvent gave 0 effects`);

    let expectedStatePath = new Map();
    expectedStatePath.set(
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

    let expectedStack = [
        NewPayEntityEvent(
            T.PlayerOneEntityCode,
            GlobalStateEntityCode,
            WithPrice(Tiles.Get(tile, state)).BasePrice,
        ),
    ];

    cases.push([
        state,
        event.Effects[0],
        'Purchase tile - ownership transfer and Pay on stack',
        {
            entityPathHas: expectedStatePath,
            stackHas: expectedStack,
        },
        Purchase,
    ]);
})();

export default cases;
