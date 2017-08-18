import {
    ZoneCode, IZone,
} from './Header';
import {
    zoneRegister,
} from './Zone';
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
 * NewZone returns an object which minimally satisfies IZone.
 *
 * NOTE: this is for Zone-internal usage only.
 *       Typical usage is to wrap this with the annotations needed
 *       to satisfy extensions to IZone.
 * @param zone Zone name to attribute this to.
 */
export function NewZone(zone: ZoneCode): IZone {
    return  {
        Self: zone,
        Contents: {},
    };
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
        let desc = zoneRegister.get(zone);
        if (desc === undefined) throw Error(`cannot access unregistered zone ${zone}`);
        z = desc.New();
        state.zones[zone] = z;
    }

    return z;
}
