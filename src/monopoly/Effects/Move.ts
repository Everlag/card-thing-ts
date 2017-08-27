import {
    IEffectPack, IEffectDescription,
    EffectPackAssertFail,
    IEvent,
} from '../../core/Event/Header';
import {
    IGameState,
} from '../../core/Game/Header';
import {
    EntityCode, GlobalStateEntityCode,
} from '../../core/Entity/Header';
import {
    getPlayerIndex,
} from '../../core/Game/Game';
import Players, {
    GetPlayerByIndex,
} from '../../core/Zone/Zones/Players';
import { WithPosition } from '../Entities/WithPosition';
import Tiles from '../Zones/Tiles';

export interface IMoveEffectPack extends IEffectPack {
    Rolls: Array<number>;
}
export function AsMove(e: IEffectPack): IMoveEffectPack {
    if (e.Effect !== Self) {
        throw EffectPackAssertFail(Self, e.Effect);
    }

    let asMove = e as IMoveEffectPack;
    if (asMove.length < 1) {
        throw EffectPackAssertFail(Self, e.Effect);
    }

    return asMove;
}

/**
 * Move translates a Player to an offset of their current Position
 * based off of the sum of the provided Rolls.
 */
export function Op(state: IGameState, pack: IEffectPack) {
    if (pack.Targets.length !== 1) {
        throw Error(`Move expects single target, got ${pack.Targets}`);
    }

    if (pack.TargetType !== Players.TargetTypes.Player) {
        throw Error(`unknown TargetType for Move: ${pack.TargetType}`);
    }

    let playerIndex = getPlayerIndex(state, pack.Targets[0]);
    let player = GetPlayerByIndex(playerIndex, state);
    let withPos = WithPosition(player);

    let asMove = AsMove(pack);
    let delta = asMove.Rolls.reduce((a, b) => a + b);

    // Fetch tileCount, we assume index starts at 0 and they are
    // sequential without gaps.
    let tileCount = Tiles.Ordered(state).length;

    // calculated position mod max tile index.
    let newPos = (withPos.Position + delta) % (tileCount - 1);
    withPos.Position = newPos;

    // TODO: handle the concept of 'Passing Go'
    // TODO: handle concept of rolling 'doubles' either here or in Roll.

    return state;
}

export const Self = 'player-move';

export const Desc = {
    Op, Self,
} as IEffectDescription;

export default Desc;

export function NewMoveEvent(player: EntityCode,
    rolls: Array<number>): IEvent {

    return {
        Effects: [
            {
                Source: GlobalStateEntityCode,
                Targets: [player],
                TargetType: Players.TargetTypes.Player,
                Effect: Self,

                Rolls: rolls,
            } as IMoveEffectPack,
        ],
    };
}
