import {
    IZone, IZoneDescription, ZoneAssertFail,
} from '../../core/Zone/Header';
import { IGameState } from '../../core/Game/Header';
import {
    AddEntity, GetEntity, GetOrderedEntityCodes, GetZone, NewZone, LazyZoneInit,
} from '../../core/Zone/Internal';

import { IAsTile, AsTile } from '../Entities/AsTile';

import { IEntity, EntityCode } from '../../core/Entity/Header';

export interface ITilesZone extends IZone {
    IsTiles: true;

    // PositionToIdentity is distinct from Ordered in that
    // a Tile can have any position separate from
    // its addition-order into the zone.
    PositionToIdentity: {
        [Position: number]: EntityCode,
    };
}
export function AsTilesZone(z: IZone): ITilesZone {
    if (!z.IsTiles) throw ZoneAssertFail('IPropertyZone', 'IsTiles');
    return z as ITilesZone;
}

export function New(): ITilesZone {
    let base = NewZone(Self);
    return {
        ...base,

        IsTiles: true,
        PositionToIdentity: {},
    };
}

export function Add(entity: IEntity, state: IGameState) {
    let zone = LazyZoneInit(GetZone(Self, state), New, state);
    let asTilesZone = AsTilesZone(zone);
    let asTile = AsTile(entity);

    // Sanity check our index
    let existingIndexEntry = asTilesZone.PositionToIdentity[asTile.Index];
    if (existingIndexEntry !== undefined) {
        throw Error(`pre-existing tile at index ${asTile.Index} prevents additon`);
    }

    // Perform the additons
    AddEntity(asTile, zone, state);
    asTilesZone.PositionToIdentity[asTile.Position] = asTile.Identity;
}

export function Get(identity: EntityCode, state: IGameState) {
    let zone = LazyZoneInit(GetZone(Self, state), New, state);
    let entity = GetEntity(identity, zone, state);
    if (entity === null) return null;
    return AsTile(entity);
}

export function Remove(identity: EntityCode, state: IGameState): IEntity {
    throw Error(`${Self} zone disallows Entity removal`);
}

export function Ordered(state: IGameState) {
    let zone = LazyZoneInit(GetZone(Self, state), New, state);
    return GetOrderedEntityCodes(zone);
}

export const Self = 'tiles';
export const TargetTypes = {
    Tile: 'tile',
};
export const Desc = {
    Self,
    TargetTypes,

    Get, Add, Remove, Ordered,
    New,
} as IZoneDescription;

export default Desc;

/**
 * GetTileByPosition returns the property associated
 * with the given position. If no property exists at the given position,
 * this returns null.
 */
export function GetTileByPosition(position: number,
    state: IGameState): IAsTile | null {

    let zone = LazyZoneInit(GetZone(Self, state), New, state);
    let asTilesZone = AsTilesZone(zone);

    let identity = asTilesZone.PositionToIdentity[position];
    if (identity === undefined) {
        return null;
    }
    let found = Get(identity, state);
    if (found === null) {
        throw Error(`failed to Get tile ${identity} after resolving position ${position}`);
    }
    return found;
}
