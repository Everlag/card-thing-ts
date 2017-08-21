import { IZone, IZoneDescription, ZoneAssertFail } from '../Header';
import { IGameState } from '../../Game/Header';
import {
    AddEntity, GetEntity, GetOrderedEntityCodes, GetZone, NewZone, LazyZoneInit,
} from '../Internal';
import { AsPlayer, IAsPlayer } from '../../Entity/Entities/AsPlayer';

import { IEntity, EntityCode } from '../../Entity/Header';

export interface IPlayersZone extends IZone {
    IsPlayers: true;

    // IndexToEntity is distinct from Ordered in that
    // a Player can have an arbitrary index separate from
    // its addition-order into the zone.
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
    AddEntity(asPlayer, zone, state);
    asPlayersZone.IndexToIdentity[asPlayer.Index] = asPlayer.Identity;
}

export function Get(identity: EntityCode, state: IGameState) {
    let zone = LazyZoneInit(GetZone(Self, state), New, state);
    let entity = GetEntity(identity, zone, state);
    if (entity === null) return null;
    return AsPlayer(entity);
}

export function Remove(identity: EntityCode, state: IGameState): IEntity {
    throw Error(`${Self} zone disallows Entity removal`);
}

export function Ordered(state: IGameState) {
    let zone = LazyZoneInit(GetZone(Self, state), New, state);
    return GetOrderedEntityCodes(zone);
}

export const Self = 'players';
export const TargetTypes = {
    Player: 'player',
};
export const Desc = {
    Self,
    TargetTypes,

    Get, Add, Remove, Ordered,
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
