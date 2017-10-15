import {
    IEntity, EntityAssertFail,
} from '../../core/Entity/Header';

export interface IAsBuildable extends IEntity {
    IsBuildable: true;

    BaseHouseCost: number;
    HouseCount: number;
}
export function AsBuildable(e: IEntity): IAsBuildable {
    if (!e.IsBuildable) throw EntityAssertFail('IAsBuildable', 'IsBuildable');

    let asBuildable = e as IAsBuildable;
    if (isNaN(asBuildable.BaseHouseCost) ||
        asBuildable.BaseHouseCost < 0) {

        throw EntityAssertFail('IAsBuildable', 'BaseHouseCost');
    }
    if (isNaN(asBuildable.HouseCount) ||
        asBuildable.HouseCount < 0) {

        throw EntityAssertFail('IAsBuildable', 'HouseCount');
    }
    return asBuildable;
}
