import {
    IEntity, EntityCode, EntityAssertFail,
} from '../../core/Entity/Header';

export interface IWithOwner extends IEntity {
    HasOwner: true;

    Owner: EntityCode;
}
export function WithOwner(e: IEntity): IWithOwner {
    if (!e.HasOwner) throw EntityAssertFail('IWithOwner', 'HasOwner');

    let withOwner = e as IWithOwner;
    if (withOwner.Owner.length < 1) {
        throw EntityAssertFail('IWithOwner', 'Owner');
    }
    return withOwner;
}

/**
 * HasOwner determines if an Entity declares that it has
 * an owner.
 */
export function HasOwner(e: IEntity): boolean {
    return e.HasOwner;
}
