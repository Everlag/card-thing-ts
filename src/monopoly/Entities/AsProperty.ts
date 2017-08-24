import {
    IEntity, EntityAssertFail,
} from '../../core/Entity/Header';

// TODO: factor out data to entity translation
import {
    IGameState,
} from '../../core/Game/Header';
import {
    getRNGContext,
} from '../../core/Game/Game';
import {
    NewEntityCode,
} from '../../core/Entity/EntityCode';

// IAsProperty must be a valid Position
import { WithPosition } from './WithPosition';

export type PropertyGroup = string;

export interface IAsProperty extends IEntity {
    IsProperty: true;

    Name: string;

    BasePrice: number;
    BaseRent: number;

    BaseHouseCost: number;

    /**
     * The property group the property belongs to for the purpose
     * of rent multiplication.
     */
    Group: PropertyGroup;
}
export function AsProperty(e: IEntity): IAsProperty {
    if (!e.IsProperty) throw EntityAssertFail('IAsProperty', 'AsProperty');

    // Ensure position is valid.
    let asProperty = e as IAsProperty;
    WithPosition(asProperty);
    return asProperty;
}

/**
 * IPropertyData describes the shape of data which IAsProperty
 * originate as.
 *
 * This is transformed
 */
export interface IPropertyData {
    name: string;
    id: string;

    position: number;
    price: number;
    rent: number;
    housecost: number;

    group: string;
}

/**
 * PropertyEntityFromData transforms IPropertyData into a
 * new Property Entity consumable by everything else.
 * @param state GameState to use for RNG context to generate identity.
 */
export function PropertyEntityFromData(data: IPropertyData,
    state: IGameState) {

    let entityCode: string = '';
    getRNGContext(state, (rng) => entityCode = NewEntityCode(rng));

    return {
        Identity: entityCode,

        IsProperty: true,
        Name: data.name,

        BasePrice: data.price,
        BaseRent: data.rent,
        BaseHouseCost: data.housecost,

        Group: data.group,

        // Satisfy WithPosition
        HasPosition: true,
        Position: data.position,
    } as IAsProperty;
}
