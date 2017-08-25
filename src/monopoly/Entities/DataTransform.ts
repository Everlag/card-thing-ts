import {
    IGameState,
} from '../../core/Game/Header';
import {
    getRNGContext,
} from '../../core/Game/Game';
import {
    NewEntityCode,
} from '../../core/Entity/EntityCode';

import { PropertyGroup, IAsTile, AsTile } from './AsTile';
import { AsProperty } from './AsProperty';

/**
 * IPropertyData describes the shape of incoming data
 * which is massaged into eventually being tile and property data.
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
 * TileEntityFromData transforms IPropertyData into a
 * new Tile Entity consumable.
 * @param state GameState to use for RNG context to generate identity.
 */
export function TileEntityFromData(data: IPropertyData,
    state: IGameState): IAsTile {

    let entityCode: string = '';
    getRNGContext(state, (rng) => entityCode = NewEntityCode(rng));

    let group: PropertyGroup;
    if (data.group in PropertyGroup) {
        group = (<PropertyGroup>data.group);
    }else {
        throw Error(`unknown property group ${data.group}`);
    }

    let tile = {
        Identity: entityCode,

        IsTile: true,

        Name: data.name,
        Group: group,

        // Satisfy WithPosition
        HasPosition: true,
        Position: data.position,
    } as IAsTile;

    // Price being present indicates it is a property
    if (isNaN(data.price)) return AsTile(tile);

    // Annotate with property requirements.
    tile.BasePrice = data.price;
    tile.BaseRent = data.rent;
    tile.BaseHouseCost = data.housecost;
    tile.IsProperty = true;
    AsProperty(tile); // Assert
    return AsTile(tile);
}