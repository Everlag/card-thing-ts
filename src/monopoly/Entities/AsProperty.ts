import {
    IEntity, EntityAssertFail,
} from '../../core/Entity/Header';

// IAsProperty must be a valid Position and Tile
import { WithPosition } from './WithPosition';
import { AsTile } from './AsTile';

export interface IAsProperty extends IEntity {
    IsProperty: true;

    BasePrice: number;
    BaseRent: number;

    BaseHouseCost: number;
}
export function AsProperty(e: IEntity): IAsProperty {
    if (!e.IsProperty) throw EntityAssertFail('IAsProperty', 'AsProperty');

    // Ensure position is valid.
    let asProperty = e as IAsProperty;
    WithPosition(asProperty);
    // Ensure tile characters are valid
    AsTile(asProperty);
    return asProperty;
}
