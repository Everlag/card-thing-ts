import { IZone, IZoneDescription, ZoneAssertFail } from '../Header';
import { IGameState } from '../../Game/Header';
import {
    AddEntity, GetEntity, GetZone, NewZone, LazyZoneInit,
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

    AddEntity(asInterceptor, zone);
}

export function Get(identity: EntityCode, state: IGameState) {
    let zone = LazyZoneInit(GetZone(Self, state), New, state);
    let entity = GetEntity(identity, zone);
    if (entity === null) return null;
    return AsInterceptor(entity);
}

export const Self = 'interceptors';
export const TargetTypes = {
    Interceptor: 'interceptor',
};
export const Desc = {
    Self,
    TargetTypes,

    Get, Add,
    New,
} as IZoneDescription;

export default Desc;

/**
 * GetOrderedInterceptors returns interceptors in insertion-order.
 */
export function GetOrderedInterceptors(state: IGameState): Array<EntityCode> {
    let zone = LazyZoneInit(GetZone(Self, state), New, state);
    let asInterceptorsZone = AsInterceptorsZone(zone);
    return asInterceptorsZone.Ordered;
}

/**
 * RemoveInterceptor removes the provided identity from the Interceptors
 * Zone.
 *
 * The return value indicates if the provided identity was found to be removed.
 * This allows the caller to enforce must-exist or might-exist semantics
 * externally.
 *
 * TODO: graduate into IZoneDescription interface to be implemented
 *       across all IZones.
 */
export function RemoveInterceptor(identity: EntityCode,
    state: IGameState): boolean {

    let zone = LazyZoneInit(GetZone(Self, state), New, state);
    let asInterceptorsZone = AsInterceptorsZone(zone);

    let existing = asInterceptorsZone.Contents[identity];
    if (existing === undefined) return false;

    // Remove from basic contents
    delete asInterceptorsZone.Contents[identity];

    // Remove from ordered list
    asInterceptorsZone.Ordered = asInterceptorsZone.Ordered.filter(v => {
        return v !== identity;
    });

    return true;
}
