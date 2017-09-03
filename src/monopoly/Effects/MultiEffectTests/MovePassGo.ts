import * as T from '../../../core/test';
import { TestCase, ISuiteDescription, CloneGameState } from '../MultiEffect_test';
import { GetPreparedGameState } from '../../helpers_test';

import Players from '../../../core/Zone/Zones/Players';
import Tiles from '../../Zones/Tiles';
import { WithPosition } from '../../Entities/WithPosition';
import { WithMoney } from '../../Entities/WithMoney';
import Move, { NewMoveEvent } from '../../Effects/Move';
import Pay from '../../Effects/Pay';

import PassingGo,
    {
        PassingGoPayout,
    } from '../../Rules/PassingGo';

let cases: Array<TestCase> = [];

const registeredEffects = [Move, Pay];

/**
 * Move, land on rent-owing tile owned by other player, pay rent.
 */
(() => {

    // This determines who will have the turn that owns the move.
    let activePlayerIdentity = T.PlayerTwoEntityCode;

    let g = GetPreparedGameState();
    g.currentTurn = activePlayerIdentity;

    let maxIndex = Tiles.Ordered(g).length - 1;

    let withPositon = WithPosition(Players.Get(activePlayerIdentity, g));
    withPositon.Position = maxIndex - 1; // Force it to wrap

    let activePlayer = Players.Get(activePlayerIdentity, g);
    let startingMoney = 40;
    WithMoney(activePlayer).Money = startingMoney;

    g.stack.push(...[
        NewMoveEvent(
            activePlayerIdentity,
            [1, 1],
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
                1, // Ensure we just wrapped
            ],
            [
                'Money',
                startingMoney + PassingGoPayout,
            ],
        ]),
    );

    cases.push([
        CloneGameState(g),
        null,
        null,
        1,
        'Move fires - Pay affixed in',
        {
            currentTurn: activePlayerIdentity,
            entityPathHas: afterMove,
            StackHeight: 0,
        },
        registeredEffects,
        [PassingGo],
    ]);
})();

export const Self = 'MovePassGo';

export const Desc = {
    Cases: cases,
    Self,
} as ISuiteDescription;

export default Desc;
