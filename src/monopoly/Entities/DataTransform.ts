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
import { AsBuildable } from './AsBuildable';
import { WithPrice } from './WithPrice';
import { WithRent } from './WithRent';

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

    // Annotations to conditionally satisfy various interfaces
    // if specific properties are present on the data.
    tile = AnnotatePrice(data, tile);
    tile = AnnotateRent(data, tile);
    tile = AnnotateBuildable(data, tile);

    return AsTile(tile);
}

/**
 * AnnotateRent satisfies the WithRent Entity if
 * `rent` is present on the data.
 */
function AnnotateRent(data: IPropertyData, tile: IAsTile): IAsTile {
    if (isNaN(data.rent)) return tile;

    tile.BaseRent = data.rent;
    tile.HasRent = true;
    WithRent(tile);
    return tile;
}

/**
 * AnnotatePrice satisfies the WithPrice Entity if
 * `price` is present on the data.
 */
function AnnotatePrice(data: IPropertyData, tile: IAsTile): IAsTile {
    if (isNaN(data.price)) return tile;

    tile.HasPrice = true;
    tile.BasePrice = data.price;
    WithPrice(tile);
    return tile;
}

/**
 * AnnotateBuildable satisfies the AsBuildable Entity if
 * `housecost` is present on the data.
 */
function AnnotateBuildable(data: IPropertyData, tile: IAsTile): IAsTile {
    if (isNaN(data.housecost)) return tile;

    tile.BaseHouseCost = data.housecost;
    tile.HouseCount = 0;
    tile.IsBuildable = true;
    AsBuildable(tile); // Assert
    return tile;
}
