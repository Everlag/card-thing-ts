import {
    ZoneCode, IZone, IZoneDescription,
    TargetType,
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
 *       AddSafeEntity which will equivalently perform this operation
 *       in a safe manner.
 * @param entity Entity to add to the Zone
 * @param zone Zone to hold the Entity
 */
export function AddEntity(entity: IEntity, zone: IZone) {
    zone.Contents[entity.Identity] = entity;
}

let zoneRegister = new Map<ZoneCode, IZoneDescription>();
let targetTypeRegister = new Map<TargetType, Array<ZoneCode>>();

/**
 * RegisterZone includes a zone in both our zoneRegister as well
 * as our targetTypeRegister when resolving a TargetType to a specific zone
 */
export function RegisterZone(desc: IZoneDescription) {
    if (zoneRegister.has(desc.Self)) {
        throw Error(`duplicated identifier for ${desc.Self}`);
    }
    zoneRegister.set(desc.Self, desc);

    // for-in is very slow, however we expect so few zones and TargetTypes
    // that it is not worth worrying about given this only runs once
    // as setup for the rest of the code.
    /* tslint:disable */
    // Disabling as it doesn't like my early return based off of
    // hasOwnProprty
    for (let ref in desc.TargetTypes) {
    /* tslint:enable */
        if (!desc.TargetTypes.hasOwnProperty(ref)) return;
        let targetType = desc.TargetTypes[ref];

        let existing = targetTypeRegister.get(targetType);
        if (existing === undefined) {
            existing = [];
        }
        existing.push(desc.Self);
        targetTypeRegister.set(targetType, existing);
    }
}

import Players from './Zones/Players';
RegisterZone(Players);

/**
 * GetZone returns the zone specified in ZoneCode.
 *
 * GetZone will lazily instantiate the Zone if it does not exist.
 * This allows IGameState to require no knowledge about what
 * Zones have been registered.
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

/**
 * AddSafeEntity adds an Entity to the zone specified in ZoneCode.
 *
 * AddSafeEntity uses the Add defined for the specific zone rather than
 * bypassing it as AddEntity does. This ensures garbage cannot be added
 * to the Zone.
 */
export function AddSafeEntity(entity: IEntity, zone: ZoneCode,
    state: IGameState) {

    let z = GetZone(zone, state);
    let desc = zoneRegister.get(zone);
    if (desc === undefined) {
        throw Error(`no description registered for zone ${zone}`);
    }
    desc.Add(entity, z);
}

/**
 * FindEntity resolves a provided EntityCode and TargetType
 * to a specific Entity.
 *
 * This throws if it fails to find the specified Entity or
 * the Entity is present in more than one Zone.
 */
export function FindEntity(identity: EntityCode, targetType: TargetType,
    state: IGameState): IEntity {

    let zones = targetTypeRegister.get(targetType);
    if (zones === undefined) {
        throw Error(`no zones registered for TargetType ${targetType}`);
    }

    // Traverse every possible zone it can exist in to lookup the identity
    let found = zones.map(z => {
        let desc = zoneRegister.get(z);
        if (desc === undefined) {
            throw Error(`no description registered for zone ${z}`);
        }
        let zone = GetZone(desc.Self, state);
        return desc.Get(identity, zone);
    }).filter(e => e != null);

    // The Entity must be in exactly 1 place. No more, no less.
    if (found.length < 0) {
        throw Error(`failed to find Entity ${identity} of targetType ${targetType}`);
    }
    if (found.length > 1) {
        throw Error(`found duplicate entries for Entity ${identity} of targetType ${targetType}`);
    }

    return found[0];
}
