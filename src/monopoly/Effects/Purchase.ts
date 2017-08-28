import {
    IEffectPack, IEffectDescription,
    IEvent,
} from '../../core/Event/Header';
import {
    EntityCode, GlobalStateEntityCode,
} from '../../core/Entity/Header';
import {
    IGameState,
} from '../../core/Game/Header';

import Players from '../../core/Zone/Zones/Players';
import Tiles from '../Zones/Tiles';

import { AsTile, PropertyGroup } from '../Entities/AsTile';
import { WithMoney } from '../Entities/WithMoney';
import { WithPrice } from '../Entities/WithPrice';
import { WithOwner } from '../Entities/WithOwner';

/**
 * Purchase sets the owner of the targeted tile to the Source
 * of this event. The amount of money held by the player is reduced
 * by the cost of the tile.
 *
 * This throws if the player has an insufficient amount of money
 * to use.
 */
export function Op(state: IGameState, pack: IEffectPack) {
    if (pack.Targets.length !== 1) {
        throw Error(`${Self} expects single target, got ${pack.Targets}`);
    }
    if (pack.Source === GlobalStateEntityCode) {
        throw Error(`${Self} cannot have Global as owner, got ${pack.Source}`);
    }

    let player = Players.Get(pack.Source, state);
    let withMoney = WithMoney(player);

    let tile = Tiles.Get(pack.Targets[0], state);
    if (AsTile(tile).Group === PropertyGroup.Special) {
        throw Error(`property group ${PropertyGroup.Special} cannot be purchased`);
    }
    let withPrice = WithPrice(tile);

    if (withPrice.BasePrice > withMoney.Money) {
        throw Error(`${player.Identity} has insufficient money to purchase tile
            price/money = ${withPrice.BasePrice}/${withMoney.Money}`);
    }

    withMoney.Money = withMoney.Money - withPrice.BasePrice;

    WithOwner(tile).Owner = player.Identity;

    return state;
};

export const Self = 'purchase-tile';

export const Desc = {
    Op, Self,
} as IEffectDescription;

export default Desc;

export function NewPurchaseTileEvent(player: EntityCode,
    tile: EntityCode): IEvent {

    return {
        Effects: [
            {
                Source: player,
                Targets: [tile],
                TargetType: Tiles.TargetTypes.Tile,
                Effect: Self,
            },
        ],
    };
}
