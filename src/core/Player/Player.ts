import {
    PlayerBehavior, PlayerAction,
    PlayerResponseQuery, IPlayerResponse,
} from './Header';
import {
    IGameState,
} from '../Game/Header';
import {
    getPlayerIndex,
} from '../Game/Game';
import {
    EntityCode,
} from '../Entity/Header';
import { GetPlayerByIndex } from '../Zone/Zones/Players';

let queryRegister = new Map<PlayerBehavior, PlayerResponseQuery>();

queryRegister.set(PlayerBehavior.AlwaysFail, (player: EntityCode,
    state: IGameState) => {

    throw Error(`${PlayerBehavior.AlwaysFail} was queried for response`);
});

queryRegister.set(PlayerBehavior.AlwaysPass, (player: EntityCode,
    state: IGameState) => {

    return {
        Action: PlayerAction.Pass,
        Effects: new Array(),
    };
});

export function GetPlayerResponse(player: EntityCode,
    state: IGameState, remoteQuery: PlayerResponseQuery): IPlayerResponse {

    let playerIndex = getPlayerIndex(state, player);
    if (player === undefined) {
        throw Error(`cannot GetPlayerResponse of unknown player ${player}`);
    }
    let behavior = GetPlayerByIndex(playerIndex, state).Behavior;

    let query: PlayerResponseQuery;
    if (behavior === PlayerBehavior.Query) {
        query = remoteQuery;
    } else {
        let storedQuery = queryRegister.get(behavior);
        if (storedQuery === undefined) {
            throw Error(`cannot GetPlayerResponse of unregistered behavior ${behavior}`);
        }
        query = storedQuery;
    }

    return query(player, state);
}
