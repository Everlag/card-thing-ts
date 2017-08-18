import {
    ZoneCode, IZone,
} from './Header';
import {
    IGameState,
} from '../Game/Header';
import { IEntity, EntityCode } from '../Entity/Header';

/**
 * GetEntity fetches an Entity from the Zone by its identity EntityCode
 *
 * null result is returned when the Entity does not exist within that Zone.
 *
 * NOTE: this is for Zone-internal usage only. Prefer to use
 *       FindEntity which will perform a search for the identity based
 *       off of the TargetType associated with it.
 * @param identity EntityCode of the entity to fetch
 * @param zone Zone to fetch from
 */
export function GetEntity(identity: EntityCode,
    zone: IZone): IEntity | null {

    let entity = zone.Contents[identity];
    if (entity === undefined) {
        return null;
    }
    return entity;
}

/**
 * AddEntity includes the provided Entity in the Zone.
 *
 * If the Zone already contains that Entity, this is a NOP.
 *
 * NOTE: this is for Zone-internal usage only. Prefer to use
 *       the Add of the specific zone.
 * @param entity Entity to add to the Zone
 * @param zone Zone to hold the Entity
 */
export function AddEntity(entity: IEntity, zone: IZone) {
    zone.Contents[entity.Identity] = entity;
}

/**
 * GetZone returns the zone specified in ZoneCode.
 *
 * GetZone will lazily instantiate the Zone if it does not exist.
 * This allows IGameState to require no knowledge about what
 * Zones have been registered.
 *
 * NOTE: this is for Zone-internal usage only.
 */
export function GetZone(zone: ZoneCode, state: IGameState): IZone {

    let z = state.zones[zone];
    if (z === undefined) {
        z = {
            Self: zone,
            Contents: {},
        };
        state.zones[zone] = z;
    }

    return z;
}
