import {
    IEffectPack, IEffectDescription,
} from '../Header';
import {
    PlayerAction, PlayerResponseQuery,
} from '../../Player/Header';
import {
    GetPlayerResponse,
} from '../../Player/Player';
import {
    getPriorities,
} from '../Effect';
import {
    IGameState,
} from '../../Game/Header';

/**
 * PlayerPriority checks for a player response and handles accordingly
 *
 * Target of PlayerPriority is the player to query a response from.
 */
export function Op(state: IGameState, pack: IEffectPack,
    remoteQuery: PlayerResponseQuery) {
    if (pack.Targets.length !== 1) {
        throw Error(`EndTurn expects single target, got ${pack.Targets}`);
    }

    let response = GetPlayerResponse(pack.Targets[0], state, remoteQuery);

    switch (response.Action) {
        case PlayerAction.Pass:
            return state;
        case PlayerAction.Use:
            // Since IPlayerResponse is just an IEvent with
            // a flag, we can simply push it onto the stack.
            //
            // We also give all players the opportunity to react.
            state.stack.push(...getPriorities(state), response);
            return state;
        default:
            throw Error(`unknown PlayerAction in response, got: ${response.Action}`);
    }
}

export const Self = 'player-priority';

export const Desc = {
    Op, Self,
} as IEffectDescription;

export default Desc;
