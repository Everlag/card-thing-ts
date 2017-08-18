import { IZoneDescription  } from '../Header';
import { IGameState } from '../../Game/Header';
import { AddEntity, GetEntity, GetZone } from '../Internal';
import { AsPlayer } from '../../Entity/Entities/AsPlayer';

import { IEntity, EntityCode } from '../../Entity/Header';

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
} as IZoneDescription;

export default Desc;
