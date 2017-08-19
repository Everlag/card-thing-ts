import {
    TargetType,
    IEffectPack, IEffectDescription,

    EffectPackAssertFail,
} from '../Header';
import {
    AsWithHealth,
} from '../../Entity/Entities/WithHealth';
import {
    IGameState,
} from '../../Game/Header';
import {
    getPlayerIndex,
} from '../../Game/Game';
import { GetPlayerByIndex } from '../../Zone/Zones/Players';

export interface IDamageEffectPack extends IEffectPack {
    Damage: number;
}
export function AsDamage(e: IEffectPack): IDamageEffectPack {
    if (e.Effect !== Self) {
        throw EffectPackAssertFail(Self, e.Effect);
    }
    return e as IDamageEffectPack;
}

/**
 * Damage removes a magnitude of health from an Entity
 * which satisfies the AsWithHealth assertion.
 */
export function Op(state: IGameState, pack: IEffectPack) {
    if (pack.Targets.length !== 1) {
        throw Error(`Damage expects single target, got ${pack.Targets}`);
    }

    let damagePack = AsDamage(pack);

    // Eventually, this will be a switch/if-elif-else
    // but for now we'll enjoy an early exit
    if (damagePack.TargetType !== TargetType.Player) {
        throw Error(`unknown TargetType for Damage: ${pack.TargetType}`);
    }

    let playerIndex = getPlayerIndex(state, damagePack.Targets[0]);
    let player = GetPlayerByIndex(playerIndex, state);

    let entity = AsWithHealth(player);
    entity.Health -= damagePack.Damage;

    return state;
}

export const Self = 'entity-damage';

export const Desc = {
    Op, Self,
} as IEffectDescription;

export default Desc;
