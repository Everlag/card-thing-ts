import { IEntity, EntityAssertFail } from '../Header';
import { ZoneCode } from '../../Zone/Header';

export interface IWithZone extends IEntity {
    HasZone: true;

    Zone: ZoneCode;
}
export function WithZone(e: IEntity): IWithZone {
    if (!e.HasZone) throw EntityAssertFail('IWithZone', 'HasZone');
    return e as IWithZone;
}

/**
 * IncludeZone implements the IWithZone interface on the provided
 * Entity if it does not have it. The provided zone will always be
 * set on the Entity even if it previously had a zone.
 * @param e Entity to mutate.
 * @param zone ZoneCode for the Entity to be associated with
 */
export function IncludeZone(e: IEntity, zone: ZoneCode): IWithZone {
    if (!e.HasZone) {
        e.HasZone = true;
    }

    e.Zone = zone;
    return WithZone(e);
}
