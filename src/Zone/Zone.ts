import {
    ZoneCode, IZoneDescription,
    TargetType,
    IZoneRegister,
} from './Header';
import {
    IGameState,
} from '../Game/Header';
import { IEntity, EntityCode } from '../Entity/Header';

let coreRegister: IZoneRegister = {
    Zones: new Map<ZoneCode, IZoneDescription>(),
    TargetTypes: new Map<TargetType, Array<ZoneCode>>(),
};

/**
 * RegisterZone includes a zone in both our zoneRegister as well
 * as our targetTypeRegister when resolving a TargetType to a specific zone
 */
export function RegisterZone(register: IZoneRegister,
    desc: IZoneDescription) {

    console.log('I have description desc', desc);
    if (register.Zones.has(desc.Self)) {
        throw Error(`duplicated identifier for ${desc.Self}`);
    }
    register.Zones.set(desc.Self, desc);

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

        let existing = register.TargetTypes.get(targetType);
        if (existing === undefined) {
            existing = [];
        }
        existing.push(desc.Self);
        register.TargetTypes.set(targetType, existing);
    }
}

import Global from './Zones/Global';
RegisterZone(coreRegister, Global);

import Players from './Zones/Players';
RegisterZone(coreRegister, Players);

import Interceptors from './Zones/Interceptors';
RegisterZone(coreRegister, Interceptors);

/**
 * NewZoneRegister constructs a ZoneRegister with all
 * core zones already registered.
 */
export function NewZoneRegister(): IZoneRegister {
    let register: IZoneRegister = {
        Zones: new Map<ZoneCode, IZoneDescription>(),
        TargetTypes: new Map<TargetType, Array<ZoneCode>>(),
    };

    coreRegister.Zones
        .forEach((zone, desc) => register.Zones.set(desc, zone));

    coreRegister.TargetTypes
        .forEach((targetType, zones) => register.TargetTypes.set(zones, targetType));

    return register;
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

    let zones = coreRegister.TargetTypes.get(targetType);
    if (zones === undefined) {
        throw Error(`no zones registered for TargetType ${targetType}`);
    }

    // Traverse every possible zone it can exist in to lookup the identity
    let found = zones.map(z => {
        let desc = coreRegister.Zones.get(z);
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
