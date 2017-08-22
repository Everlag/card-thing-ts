import {
    IEffectPack, IEffectDescription,
} from '../Header';
import {
    NewStartTurnEvent,
} from '../Event';
import {
    IGameState,
} from '../../Game/Header';
import {
        GetPlayerIndex, GetPlayerByIndex,
        GetPlayerCount,
    } from '../../Zone/Zones/Players';

/**
 * EndTurn pushes a StartTurn.
 *
 * Target of EndTurn is the player whose turn is currently completing.
 */
export function Op(state: IGameState, pack: IEffectPack) {
    if (pack.Targets.length !== 1) {
        throw Error(`EndTurn expects single target, got ${pack.Targets}`);
    }

    // Set a StartTurn
    let currentPlayerIndex = GetPlayerIndex(pack.Targets[0], state);
    let nextPlayerIndex = (currentPlayerIndex + 1) % GetPlayerCount(state);
    let nextPlayer = GetPlayerByIndex(nextPlayerIndex, state);
    let startTurn = NewStartTurnEvent(nextPlayer.Identity);

    state.stack.push(startTurn);

    return state;
}

export const Self = 'end-turn';

export const Desc = {
    Op, Self,
} as IEffectDescription;

export default Desc;
