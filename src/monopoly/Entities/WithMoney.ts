import {
    IEntity, EntityAssertFail,
} from '../../core/Entity/Header';

export interface IWithMoney extends IEntity {
    HasMoney: true;

    Money: number;
}
export function WithMoney(e: IEntity): IWithMoney {
    if (!e.HasMoney) throw EntityAssertFail('IWithMoney', 'HasMoney');

    // Ensure money is valid.
    let withMoney = e as IWithMoney;
    if (isNaN(withMoney.Money)) {
        throw EntityAssertFail('IWithMoney', 'Money');
    }
    return withMoney;
}
