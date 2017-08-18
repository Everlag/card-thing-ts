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
 * @param identity EntityCode of the entity to fetch
 * @param zone Zone to fetch from
 */
export function GetEntity(identity: EntityCode, zone: IZone): IEntity {
    let entity = zone.Contents[(<string>identity)];
    if (entity === undefined) {
        throw Error(`cannot find Entity ${identity} in ${zone}`);
    }
    return entity;
}

/**
 * AddEntity includes the provided Entity in the Zone.
 *
 * If the Zone already contains that Entity, this is a NOP.
 * @param entity Entity to add to the Zone
 * @param zone Zone to hold the Entity
 */
export function AddEntity(entity: IEntity, zone: IZone) {
    zone.Contents[(<string>entity.Identity)] = entity;
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
    for (let targetType in desc.TargetTypes) {
    /* tslint:enable */
        if (!desc.TargetTypes.hasOwnProperty(targetType)) return;

        let existing = targetTypeRegister.get(targetType);
        if (existing === undefined) {
            existing = [];
        }
        existing.push(desc.Self);
        targetTypeRegister.set(targetType, existing);
    }
    console.log('zone register looks like', zoneRegister);
}

import Players from './Zones/Players';
RegisterZone(Players);

/**
 * GetZone returns the zone specified in ZoneCode
 */
export function GetZone(zone: ZoneCode, state: IGameState): IZone {

    throw Error('unimplemented');
}

/**
 * FindEntity resolves a provided EntityCode and TargetType
 * to a specific Entity.
 */
export function FindEntity(identity: EntityCode, targetType: TargetType,
    state: IGameState): IEntity {

    throw Error('unimplemented');
}
