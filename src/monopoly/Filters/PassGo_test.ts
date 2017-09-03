import { TestCase } from './Filters_test';
import * as T from '../../core/test';
import { GetPreparedGameState } from '../helpers_test';

import { IGameState } from '../../core/Game/Header';

import Players from '../../core/Zone/Zones/Players';
import Tiles from '../Zones/Tiles';

import { WithPosition } from '../Entities/WithPosition';

import PassGo, { Self, IPassesGo } from './PassGo';
import Move,
    {
        NewMoveEvent, IMoveEffectPack, AsMove,
    } from '../Effects/Move';

let cases = new Array<TestCase>();

const defaultPlayer = T.PlayerOneEntityCode;

/**
 * getBaseConfig instantiates and returns fresh copies of the baseline
 * configuration used in TestCases for PassGo.
 *
 * By default, this is not expected to pass go as the default player
 * configuration is located at the zeroth index and the GameState has
 * more than a single tile registered.
 */
function getBaseConfig(): [IMoveEffectPack, IGameState] {
    let rolls = [1, 0];
    let event = NewMoveEvent(defaultPlayer, rolls);
    if (event.Effects.length < 1) {
        throw Error(`${Self} test cannot run as NewMoveEvent failed to return >0 effects}`);
    }
    let effect = event.Effects[0];

    let state = GetPreparedGameState();

    return [AsMove(effect), state];
}

(() => {
    let [effect, state] = getBaseConfig();

    cases.push([
        effect,
        state,
        {
            Effect: Move.Self,
            PassesGo: true,
        } as IPassesGo,
        `${Self} filter does not match when not passing go`,
        false,
        PassGo,
    ]);
})();

(() => {
    let [effect, state] = getBaseConfig();

    // Move the player to be at the tile immediately before 'go'
    let maxTileIndex = Tiles.Ordered(state).length - 1;
    let maxIndexBeforePassingGo = maxTileIndex - 1;

    let withPos = WithPosition(Players.Get(defaultPlayer, state));
    withPos.Position = maxIndexBeforePassingGo;

    cases.push([
        effect,
        state,
        {
            Effect: Move.Self,
            PassesGo: true,
        } as IPassesGo,
        `${Self} filter matches when passing go - small roll`,
        true,
        PassGo,
    ]);
})();

(() => {
    let [effect, state] = getBaseConfig();

    const maxRollSum = 12;
    if (maxRollSum % 2 !== 0) throw Error(`${Self} requires maximum roll sum to be divisible by 2`);
    effect.Rolls = [maxRollSum / 2, maxRollSum / 2];

    let maxTileIndex = Tiles.Ordered(state).length - 1;
    let maxIndexBeforePassingGo = maxTileIndex - maxRollSum;

    let withPos = WithPosition(Players.Get(defaultPlayer, state));
    withPos.Position = maxIndexBeforePassingGo;

    cases.push([
        effect,
        state,
        {
            Effect: Move.Self,
            PassesGo: true,
        } as IPassesGo,
        `${Self} filter matches when passing go - large roll`,
        true,
        PassGo,
    ]);
})();

export default cases;
