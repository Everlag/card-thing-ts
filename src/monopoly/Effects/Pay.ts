import {
    IEffectPack, IEffectDescription, EffectPackAssertFail, IEvent,
} from '../../core/Event/Header';
import {
    GlobalStateEntityCode, EntityCode,
} from '../../core/Entity/Header';
import {
    IGameState,
} from '../../core/Game/Header';

import Players from '../../core/Zone/Zones/Players';
import { WithMoney } from '../Entities/WithMoney';

export interface IPayEffectPack extends IEffectPack {
    Amount: number;
}
export function AsPay(e: IEffectPack): IPayEffectPack {
    if (e.Effect !== Self) {
        throw EffectPackAssertFail(Self, e.Effect);
    }
    return e as IPayEffectPack;
}

/**
 * Pay transfers amount from the source entity to the targeted entity.
 *
 * If the targeted entity is the Global entity, the money is
 * considered to be discarded to the bank rather than another player.
 */
export function Op(state: IGameState, pack: IEffectPack) {
    if (pack.Targets.length !== 1) {
        throw Error(`${Self} expects single target, got ${pack.Targets}`);
    }

    let payPack = AsPay(pack);

    let player = Players.Get(pack.Source, state);
    let withMoney = WithMoney(player);

    if (payPack.Amount > withMoney.Money) {
        throw Error(`${player.Identity} has insufficient money to satisfy Pay
            required/has = ${payPack.Amount}/${withMoney.Money}`);
    }

    withMoney.Money -= payPack.Amount;

    // Early exit as we've done our job if we're paying the bank.
    let toPay = pack.Targets[0];
    if (toPay === GlobalStateEntityCode) return state;

    WithMoney(Players.Get(toPay, state)).Money += payPack.Amount;

    return state;
};

export const Self = 'pay-entity';

export const Desc = {
    Op, Self,
} as IEffectDescription;

export default Desc;

export function NewPayEntityEvent(player: EntityCode,
    receiver: EntityCode, amount: number): IEvent {

    return {
        Effects: [
            {
                Source: player,
                Targets: [receiver],
                TargetType: Players.TargetTypes.Player,
                Effect: Self,

                Amount: amount,
            } as IPayEffectPack,
        ],
    };
}
