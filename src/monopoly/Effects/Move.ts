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
import { HasRent, WithRent } from '../Entities/WithRent';
import { HasOwner, WithOwner } from '../Entities/WithOwner';
import Tiles, { GetTileByPosition } from '../Zones/Tiles';

import { NewPayEntityEvent } from './Pay';

/**
 * PassingGoPayout is the amount of money paid when a player
 * 'passes go', which is considered to be wrapping around the board.
 */
export const PassingGoPayout = 200;

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
 * IsMove determines if the provided EffectPack can be considered
 * a Move.
 */
export function IsMove(e: IEffectPack): boolean {
    return e.Effect === Self;
}

function MaybePassedGo(
    state: IGameState,
    player: EntityCode,
    oldPos: number, newPos: number,
): IGameState {

    // If we wrapped, then we passed go.
    if (oldPos <= newPos) return state;

    // Set the payer up to be credited in the next tick
    let payEvent = NewPayEntityEvent(
        GlobalStateEntityCode,
        player,
        PassingGoPayout,
    );
    state.stack.push(payEvent);

    return state;
}

function MaybeShouldPayRent(
    state: IGameState, player: EntityCode,
): IGameState {

    let withPos = WithPosition(Players.Get(player, state));
    let tile = GetTileByPosition(withPos.Position, state);
    if (tile === null) {
        throw Error(`player had invalid position: ${JSON.stringify(withPos)}`);
    }

    // If the tile can't have rent paid, then we simply cannot
    if (!HasRent(tile)) return state;
    // TODO: handle non-base rent
    let rent = WithRent(tile).BaseRent;

    // Determine who the owner is. If the tile has no owner,
    // then we cannot pay rent
    if (!HasOwner(tile)) return state;
    let owner = WithOwner(tile).Owner;

    // We don't pay the bank as they are the default owners
    // of property. We also don't pay ourselves if we're the owner.
    if (owner === GlobalStateEntityCode ||
        owner === player) return state;

    // Set the a transfer to move money in the next tick
    //
    // TODO: consider if we should be validating that the debited
    //       Entity can pay. Perhaps Pay should be the sole-user
    //       of that?
    let payEvent = NewPayEntityEvent(
        player,
        owner,
        rent,
    );
    state.stack.push(payEvent);

    return state;
}

/**
 * WrapPlayerPostion takes the player at its current position
 * and computes its new position based off of the provided delta
 */
export function WrapPlayerPostion(player: EntityCode,
    delta: number, state: IGameState): number {

    // Fetch tileCount, we assume index starts at 0 and they are
    // sequential without gaps.
    let tileCount = Tiles.Ordered(state).length;

    let withPos = WithPosition(Players.Get(player, state));

    // calculated position mod max tile index.
    return (withPos.Position + delta) % (tileCount - 1);
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

    let newPos = WrapPlayerPostion(player.Identity, delta, state);
    let oldPos = withPos.Position;
    withPos.Position = newPos;

    MaybePassedGo(state, player.Identity, oldPos, newPos);
    MaybeShouldPayRent(state, player.Identity);

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
