import { IZone, IZoneDescription, ZoneAssertFail } from '../Header';
import { IGameState } from '../../Game/Header';
import {
    AddEntity, GetEntity, GetZone, NewZone, LazyZoneInit,
} from '../Internal';
import { AsPlayer, IAsPlayer } from '../../Entity/Entities/AsPlayer';

import { IEntity, EntityCode } from '../../Entity/Header';

export interface IPlayersZone extends IZone {
    IsPlayers: true;

    // TODO: review transitioning Count to exist in the IZone definition
    //       as it seems useful across most situations.
    Count: number;
    IndexToIdentity: {
        [Index: number]: EntityCode,
    };
}
export function AsPlayersZone(z: IZone): IPlayersZone {
    if (!z.IsPlayers) throw ZoneAssertFail('IPlayersZone', 'IsPlayers');
    return z as IPlayersZone;
}

export function New(): IPlayersZone {
    let base = NewZone(Self);
    return {
        ...base,

        Count: 0,
        IsPlayers: true,
        IndexToIdentity: {},
    };
}

export function Add(entity: IEntity, state: IGameState) {
    let zone = LazyZoneInit(GetZone(Self, state), New, state);
    let asPlayersZone = AsPlayersZone(zone);
    let asPlayer = AsPlayer(entity);

    // Sanity check our index
    let existingIndexEntry = asPlayersZone.IndexToIdentity[asPlayer.Index];
    if (existingIndexEntry !== undefined) {
        throw Error(`pre-existing player at index ${asPlayer.Index} prevents additon`);
    }

    // Perform the additons
    AddEntity(asPlayer, zone);
    asPlayersZone.IndexToIdentity[asPlayer.Index] = asPlayer.Identity;
    asPlayersZone.Count++;
}

export function Get(identity: EntityCode, state: IGameState) {
    let zone = LazyZoneInit(GetZone(Self, state), New, state);
    let entity = GetEntity(identity, zone);
    if (entity === null) return null;
    return AsPlayer(entity);
}

export const Self = 'players';
export const TargetTypes = {
    Player: 'player',
};
export const Desc = {
    Self,
    TargetTypes,

    Get, Add,
    New,
} as IZoneDescription;

export default Desc;

/**
 * GetPlayerCount returns the number of players in the Zone.
 */
export function GetPlayerCount(state: IGameState): number {
    let zone = LazyZoneInit(GetZone(Self, state), New, state);
    let asPlayersZone = AsPlayersZone(zone);
    return asPlayersZone.Count;
}

/**
 * GetPlayerIndex returns the index associated with the given player.
 */
export function GetPlayerIndex(identity: EntityCode, state: IGameState): number {
    let player = Get(identity, state);
    if (player === null) throw Error(`cannot find unknown player ${identity}`);
    return player.Index;
}

/**
 * GetPlayerByIndex returns the player associated with the given index.
 */
export function GetPlayerByIndex(index: number, state: IGameState): IAsPlayer {
    let zone = LazyZoneInit(GetZone(Self, state), New, state);
    let asPlayersZone = AsPlayersZone(zone);

    let identity = asPlayersZone.IndexToIdentity[index];
    if (identity === undefined) {
        throw Error(`unknown index entry at number ${identity}`);
    }
    let found = Get(identity, state);
    if (found === null) {
        throw Error(`failed to Get player ${identity} after resolving index ${index}`);
    }
    return found;
}
