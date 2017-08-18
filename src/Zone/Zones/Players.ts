import { IZone, IZoneDescription, ZoneAssertFail } from '../Header';
import { IGameState } from '../../Game/Header';
import { AddEntity, GetEntity, GetZone, NewZone } from '../Internal';
import { AsPlayer } from '../../Entity/Entities/AsPlayer';

import { IEntity, EntityCode } from '../../Entity/Header';

export interface IPlayersZone extends IZone {
    IsPlayers: true;

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
    let zone = GetZone(Self, state);
    let asPlayer = AsPlayer(entity);
    AddEntity(asPlayer, zone);
}

export function Get(identity: EntityCode, state: IGameState) {
    let zone = GetZone(Self, state);
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
