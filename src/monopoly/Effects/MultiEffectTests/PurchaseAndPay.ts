import * as T from '../../../core/test';
import { TestCase, ISuiteDescription, CloneGameState } from '../MultiEffect_test';
import { GetPreparedGameState } from '../../helpers_test';
import { GlobalStateEntityCode } from '../../../core/Entity/Header';

import Players from '../../../core/Zone/Zones/Players';
import Tiles from '../../Zones/Tiles';

import { AsTile, PropertyGroup } from '../../Entities/AsTile';
import { WithPrice } from '../../Entities/WithPrice';
import { WithMoney } from '../../Entities/WithMoney';

import Purchase, { NewPurchaseTileEvent } from '../../Effects/Purchase';
import Pay, { NewPayEntityEvent } from '../../Effects/Pay';

let cases: Array<TestCase> = [];

const registeredEffects = [Purchase, Pay];

/**
 * Purchase tile and pay for it.
 */
(() => {
    // This determines who will have the turn that owns the move.
    let activePlayerIdentity = T.PlayerTwoEntityCode;

    let g = GetPreparedGameState();

    // Find a tile to purchase
    let purchasable = Tiles.Ordered(g).filter(t => {
        return AsTile(Tiles.Get(t, g)).Group !== PropertyGroup.Special;
    });
    if (purchasable.length === 0) throw Error('failed to find purchasable tiles');
    let toPurchase = purchasable[0];
    let priceToPay = WithPrice(Tiles.Get(toPurchase, g)).BasePrice;

    // Ensure we can purchase this
    let playerStartingMoney = priceToPay + 1;
    WithMoney(Players.Get(activePlayerIdentity, g)).Money = playerStartingMoney;

    // Actually set ourselves to purchase the tile
    g.stack.push(...[
        NewPurchaseTileEvent(activePlayerIdentity, toPurchase),
    ]);

    let postPurchaseEntityHas = new Map();
    postPurchaseEntityHas.set(
        toPurchase,
        new Map<any, any>([
            [
                'Identity',
                toPurchase,
            ],
            [
                'Zone',
                Tiles.Self,
            ],
            [
                'Owner',
                activePlayerIdentity,
            ],
        ]),
    );

    postPurchaseEntityHas.set(
        activePlayerIdentity,
        new Map<any, any>([
            [
                'Identity',
                activePlayerIdentity,
            ],
            [
                'Zone',
                Players.Self,
            ],
            [
                'Money',
                playerStartingMoney,
            ],
        ]),
    );

    let postPurchaseExpectedStack = [
        NewPayEntityEvent(
            activePlayerIdentity,
            GlobalStateEntityCode,
            priceToPay,
        ),
    ];

    cases.push([
        CloneGameState(g),
        null,
        null,
        1,
        'Purchase fires - ownership transfers',
        {
            entityPathHas: postPurchaseEntityHas,
            stackHas: postPurchaseExpectedStack,
        },
        registeredEffects,
        undefined,
    ]);

    let postPayEntityHas = new Map();
    postPayEntityHas.set(
        activePlayerIdentity,
        new Map<any, any>([
            [
                'Identity',
                activePlayerIdentity,
            ],
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
        CloneGameState(g),
        null,
        null,
        2,
        'Pay fires - player money reduced',
        {
            entityPathHas: postPayEntityHas,
            StackHeight: 0,
        },
        registeredEffects,
        undefined,
    ]);

})();

export const Self = 'PurchaseAndPay';

export const Desc = {
    Cases: cases,
    Self,
} as ISuiteDescription;

export default Desc;
