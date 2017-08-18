import { IZone } from './Header';
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
