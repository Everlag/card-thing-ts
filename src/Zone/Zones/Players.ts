import { IZone, IZoneDescription  } from '../Header';
import { AddEntity, GetEntity } from '../Zone';
import { AsPlayer } from '../../Entity/Entities/AsPlayer';

import { IEntity, EntityCode } from '../../Entity/Header';

export function Add(entity: IEntity, zone: IZone) {
    let asPlayer = AsPlayer(entity);
    AddEntity(asPlayer, zone);
}

export function Get(identity: EntityCode, zone: IZone) {
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
