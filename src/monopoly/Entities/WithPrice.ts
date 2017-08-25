import {
    IEntity, EntityAssertFail,
} from '../../core/Entity/Header';

export interface IWithPrice extends IEntity {
    HasPrice: true;

    BasePrice: number;
}
export function WithPrice(e: IEntity): IWithPrice {
    if (!e.HasPrice) throw EntityAssertFail('IWithPrice', 'HasPrice');

    // Ensure position is valid.
    let withPrice = e as IWithPrice;
    if (isNaN(withPrice.BasePrice) ||
        withPrice.BasePrice < 0) {

        throw EntityAssertFail('IWithPrice', 'BasePrice');
    }
    return withPrice;
}
