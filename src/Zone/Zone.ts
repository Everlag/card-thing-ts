import {
    ZoneCode, IZoneDescription,
    TargetType,
} from './Header';
import {
    IGameState,
} from '../Game/Header';
import { IEntity, EntityCode } from '../Entity/Header';

/**
 * Exported to allow Zone tests to run.
 *
 * TODO: refactor to not require or to standardize
 */
export const zoneRegister = new Map<ZoneCode, IZoneDescription>();
let targetTypeRegister = new Map<TargetType, Array<ZoneCode>>();

/**
 * RegisterZone includes a zone in both our zoneRegister as well
 * as our targetTypeRegister when resolving a TargetType to a specific zone
 */
export function RegisterZone(desc: IZoneDescription) {
    console.log('I have description desc', desc);
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

import Interceptors from './Zones/Interceptors';
RegisterZone(Interceptors);

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
        return desc.Get(identity, state);
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
