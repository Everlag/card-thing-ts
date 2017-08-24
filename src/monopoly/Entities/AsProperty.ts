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

export type PropertyGroup = string;

export interface IAsProperty extends IEntity {
    IsProperty: true;

    Name: string;
    Position: number;

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
    return e as IAsProperty;
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
        Position: data.position,

        BasePrice: data.price,
        BaseRent: data.rent,
        BaseHouseCost: data.housecost,

        Group: data.group,
    } as IAsProperty;
}
