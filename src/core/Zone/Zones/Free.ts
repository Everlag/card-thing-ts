import { IZoneDescription } from '../Header';
import { IGameState } from '../../Game/Header';
import {
    AddEntity, GetEntity, RemoveEntity, GetOrderedEntityCodes,
    GetZone, NewZone, LazyZoneInit,
} from '../Internal';

import { IEntity, EntityCode } from '../../Entity/Header';

export function New() {
    let base = NewZone(Self);
    return base;
}

export function Add(entity: IEntity, state: IGameState) {
    let zone = LazyZoneInit(GetZone(Self, state), New, state);

    AddEntity(entity, zone, state);
}

export function Get(identity: EntityCode, state: IGameState) {
    let zone = LazyZoneInit(GetZone(Self, state), New, state);
    let entity = GetEntity(identity, zone, state);
    if (entity === null) return null;
    return entity;
}

export function Remove(identity: EntityCode, state: IGameState) {
    let zone = LazyZoneInit(GetZone(Self, state), New, state);
    return RemoveEntity(identity, zone, state);
}

export function Ordered(state: IGameState) {
    let zone = LazyZoneInit(GetZone(Self, state), New, state);
    return GetOrderedEntityCodes(zone);
}

/**
 * Free is a pseudo-Zone used to transition Entities between zones.
 *
 * Entities which are 'removed' are assigned into this Zone.
 *
 * It is possible to 'garbage collect' entities by iterating over
 * Ordered when an Entity is not transitioning.
 * ie, garbage collection following an Event containing a
 * RemoveIntercept effect. That Interceptor would be assigned into
 * this Zone.
 *
 * Unlike global, entities can be accessed  while here.
 */
export const Self = 'free';
export const TargetTypes = {}; // May not be targeted
export const Desc = {
    Self,
    TargetTypes,

    Get, Add, Remove, Ordered,
    New,
} as IZoneDescription;

export default Desc;
