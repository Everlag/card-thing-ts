import {
    IEntity, EntityAssertFail,
} from '../../core/Entity/Header';

export interface IWithRent extends IEntity {
    HasRent: true;

    BaseRent: number;
}
export function WithRent(e: IEntity): IWithRent {
    if (!e.HasRent) throw EntityAssertFail('IWithRent', 'HasRent');

    let withRent = e as IWithRent;
    if (isNaN(withRent.BaseRent) ||
        withRent.BaseRent < 0) {

        throw EntityAssertFail('IWithRent', 'BaseRent');
    }
    return withRent;
}
