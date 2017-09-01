import * as T from '../../../core/test';
import { TestCase, ISuiteDescription, CloneGameState } from '../MultiEffect_test';
import { GetPreparedGameState } from '../../helpers_test';

import Players from '../../../core/Zone/Zones/Players';
import Tiles from '../../Zones/Tiles';

import { HasOwner, WithOwner } from '../../Entities/WithOwner';
import { HasRent, WithRent } from '../../Entities/WithRent';
import { WithPosition } from '../../Entities/WithPosition';
import { WithMoney } from '../../Entities/WithMoney';
import Move, { NewMoveEvent } from '../../Effects/Move';
import Pay, { NewPayEntityEvent } from '../../Effects/Pay';

let cases: Array<TestCase> = [];

const registeredEffects = [Move, Pay];

/**
 * Move, land on rent-owing tile owned by other player, pay rent.
 */
(() => {

    // This determines who will have the turn that owns the move.
    let activePlayerIdentity = T.PlayerTwoEntityCode;
    let nonActivePlayerIdentity = T.PlayerOneEntityCode;

    let g = GetPreparedGameState(false);
    g.currentTurn = activePlayerIdentity;

    // Find tile and position we can use
    let firstUsableTile = Tiles.Ordered(g).find(t => {
        let tile = Tiles.Get(t, g);
        return HasOwner(tile) && HasRent(tile);
    });
    if (firstUsableTile === undefined) {
        throw Error('could not find satisfactory tile for Move pays rent');
    }
    let tile = Tiles.Get(firstUsableTile, g);
    let tilePos = WithPosition(tile).Position;

    WithOwner(tile).Owner = nonActivePlayerIdentity;

    let activePlayer = Players.Get(activePlayerIdentity, g);
    let leftoverMoney = 41; // Ensure correct amount is expended.
    let rentCost = WithRent(tile).BaseRent;
    let startingMoney = leftoverMoney + rentCost;
    WithMoney(activePlayer).Money = startingMoney;

    g.stack.push(...[
        NewMoveEvent(
            activePlayerIdentity,
            [tilePos - 1, 1],
        ),
    ]);

    let afterMove = new Map();
    afterMove.set(
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
                'Position',
                tilePos,
            ],
            [
                'Money',
                startingMoney,
            ],
        ]),
    );

    let postMoveExpected = [
        NewPayEntityEvent(
            activePlayerIdentity,
            nonActivePlayerIdentity,
            rentCost,
        ),
    ];

    cases.push([
        CloneGameState(g),
        null,
        null,
        1,
        'Move fires - Pay put on stack',
        {
            currentTurn: activePlayerIdentity,
            entityPathHas: afterMove,
            // Establish strong stack constraint
            stackHas: postMoveExpected,
        },
        registeredEffects,
    ]);

    let afterPay = new Map();
    afterPay.set(
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
                'Position',
                tilePos,
            ],
            [
                'Money',
                leftoverMoney,
            ],
        ]),
    );
    afterPay.set(
        nonActivePlayerIdentity,
        new Map<any, any>([
            [
                'Identity',
                nonActivePlayerIdentity,
            ],
            [
                'Zone',
                Players.Self,
            ],
            [
                'Money',
                rentCost,
            ],
        ]),
    );

    cases.push([
        CloneGameState(g),
        null,
        null,
        2,
        'Pay fires - active player debited',
        {
            currentTurn: activePlayerIdentity,
            entityPathHas: afterPay,
            StackHeight: 0,
        },
        registeredEffects,
    ]);

})();

export const Self = 'MovePayRent';

export const Desc = {
    Cases: cases,
    Self,
} as ISuiteDescription;

export default Desc;
