import {
    ZoneCode, IZone, NewZoneOperator,
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
    zone.Ordered.push(entity.Identity);
    zone.Count++;
}

/**
 * RemoveEntity removes the provided Entity from the Zone.
 * The Entity is returned.
 *
 * If the Zone does not contain that Entity, this returns null.
 *
 * NOTE: this is for Zone-internal usage only. Prefer to use
 *       the Add of the specific zone.
 * @param identity Entity to remove from the Zone
 * @param zone Zone holding the Entity
 */
export function RemoveEntity(identity: EntityCode, zone: IZone) {
    let existing = zone.Contents[identity];
    if (existing === undefined) return null;

    // Remove from basic contents
    delete zone.Contents[identity];

    // Remove from ordered list
    zone.Ordered = zone.Ordered.filter(v => {
        return v !== identity;
    });

    // Decrement count
    zone.Count--;
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
        Count: 0,
        Ordered: [],
        Contents: {},
    };
}

/**
 * GetZone returns the zone specified in ZoneCode.
 *
 * GetZone returns null if it cannot find the Zone.
 * This indicates that the Zone should be initialized by the caller.
 *
 * NOTE: this is for Zone-internal usage only.
 */
export function GetZone(zone: ZoneCode, state: IGameState): IZone | null {

    let z = state.zones[zone];
    if (z === undefined) return null;

    return z;
}

/**
 * LazyZoneInit initializes the passed IZone if it is null.
 *
 * This allows zones to be created lazily without requiring significant
 * boilerplate in the GameState
 * @param zone
 */
export function LazyZoneInit(zone: IZone | null,
    newOp: NewZoneOperator, state: IGameState): IZone {

    if (zone === null) {
        zone = newOp();
        state.zones[zone.Self] = zone;
    }
    return zone;
}
