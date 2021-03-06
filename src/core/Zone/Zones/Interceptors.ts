import { IZone, IZoneDescription, ZoneAssertFail } from '../Header';
import { IGameState } from '../../Game/Header';
import {
    AddEntity, GetEntity, RemoveEntity, GetOrderedEntityCodes,
    GetZone, NewZone, LazyZoneInit,
} from '../Internal';
import { AsInterceptor } from '../../Entity/Entities/AsInterceptor';

import { IEntity, EntityCode } from '../../Entity/Header';

export interface IInterceptorsZone extends IZone {
    IsInterceptors: true;
}
export function AsInterceptorsZone(z: IZone): IInterceptorsZone {
    if (!z.IsInterceptors) throw ZoneAssertFail('IInterceptorsZone', 'IsInterceptors');
    return z as IInterceptorsZone;
}

export function New(): IInterceptorsZone {
    let base = NewZone(Self);
    return {
        ...base,

        IsInterceptors: true,
    };
}

export function Add(entity: IEntity, state: IGameState) {
    let zone = LazyZoneInit(GetZone(Self, state), New, state);
    let asInterceptor = AsInterceptor(entity);

    AddEntity(asInterceptor, zone, state);
}

export function Get(identity: EntityCode, state: IGameState) {
    let zone = LazyZoneInit(GetZone(Self, state), New, state);
    let entity = GetEntity(identity, zone, state);
    if (entity === null) return null;
    return AsInterceptor(entity);
}

export function Remove(identity: EntityCode, state: IGameState) {
    let zone = LazyZoneInit(GetZone(Self, state), New, state);
    return RemoveEntity(identity, zone, state);
}

export function Ordered(state: IGameState) {
    let zone = LazyZoneInit(GetZone(Self, state), New, state);
    return GetOrderedEntityCodes(zone);
}

export const Self = 'interceptors';
export const TargetTypes = {
    Interceptor: 'interceptor',
};
export const Desc = {
    Self,
    TargetTypes,

    Get, Add, Remove, Ordered,
    New,
} as IZoneDescription;

export default Desc;
