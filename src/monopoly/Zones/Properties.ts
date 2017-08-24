import {
    IZone, IZoneDescription, ZoneAssertFail,
} from '../../core/Zone/Header';
import { IGameState } from '../../core/Game/Header';
import {
    AddEntity, GetEntity, GetOrderedEntityCodes, GetZone, NewZone, LazyZoneInit,
} from '../../core/Zone/Internal';

import { IAsProperty, AsProperty } from '../Entities/AsProperty';

import { IEntity, EntityCode } from '../../core/Entity/Header';

export interface IPropertiesZone extends IZone {
    IsProperties: true;

    // PositionToIdentity is distinct from Ordered in that
    // a Property can have any position separate from
    // its addition-order into the zone.
    PositionToIdentity: {
        [Position: number]: EntityCode,
    };
}
export function AsPropertiesZone(z: IZone): IPropertiesZone {
    if (!z.IsProperties) throw ZoneAssertFail('IPropertyZone', 'IsProperties');
    return z as IPropertiesZone;
}

export function New(): IPropertiesZone {
    let base = NewZone(Self);
    return {
        ...base,

        IsProperties: true,
        PositionToIdentity: {},
    };
}

export function Add(entity: IEntity, state: IGameState) {
    let zone = LazyZoneInit(GetZone(Self, state), New, state);
    let asPropertiesZone = AsPropertiesZone(zone);
    let asProperty = AsProperty(entity);

    // Sanity check our index
    let existingIndexEntry = asPropertiesZone.PositionToIdentity[asProperty.Index];
    if (existingIndexEntry !== undefined) {
        throw Error(`pre-existing property at index ${asProperty.Index} prevents additon`);
    }

    // Perform the additons
    AddEntity(asProperty, zone, state);
    asPropertiesZone.PositionToIdentity[asProperty.Position] = asProperty.Identity;
}

export function Get(identity: EntityCode, state: IGameState) {
    let zone = LazyZoneInit(GetZone(Self, state), New, state);
    let entity = GetEntity(identity, zone, state);
    if (entity === null) return null;
    return AsProperty(entity);
}

export function Remove(identity: EntityCode, state: IGameState): IEntity {
    throw Error(`${Self} zone disallows Entity removal`);
}

export function Ordered(state: IGameState) {
    let zone = LazyZoneInit(GetZone(Self, state), New, state);
    return GetOrderedEntityCodes(zone);
}

export const Self = 'properties';
export const TargetTypes = {
    Property: 'property',
};
export const Desc = {
    Self,
    TargetTypes,

    Get, Add, Remove, Ordered,
    New,
} as IZoneDescription;

export default Desc;

/**
 * GetPropertyByPosition returns the property associated
 * with the given position. If no property exists at the given position,
 * this returns null.
 */
export function GetPropertyByPosition(position: number,
    state: IGameState): IAsProperty | null {

    let zone = LazyZoneInit(GetZone(Self, state), New, state);
    let asPropertiesZone = AsPropertiesZone(zone);

    let identity = asPropertiesZone.PositionToIdentity[position];
    if (identity === undefined) {
        return null;
    }
    let found = Get(identity, state);
    if (found === null) {
        throw Error(`failed to Get property ${identity} after resolving position ${position}`);
    }
    return found;
}
