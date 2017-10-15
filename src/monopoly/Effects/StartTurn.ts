import {
    IEffectPack, IEffectDescription,
    IEvent,
} from '../../core/Event/Header';
import {
    NewEndTurnEvent, NewPlayerPriorityEvent,
} from '../../core/Event/Event';
import {
    EntityCode, GlobalStateEntityCode,
} from '../../core/Entity/Header';
import {
    IGameState,
} from '../../core/Game/Header';
import {
    getRNGContext,
} from '../../core/Game/Game';

import Players from '../../core/Zone/Zones/Players';

import { NewMoveEvent } from './Move';

/**
 * StartTurn pushes
 * - move with pre-configured Roll
 * - player-priority for the active player(This effect's target)
 * - end-turn for the active player
 * These should be executed first to last. Hence, pushed in reverse order.
 *
 * Target of StartTurn is the player whose turn
 * it is when this resolves.
 */
export function Op(state: IGameState, pack: IEffectPack) {
    if (pack.Targets.length !== 1) {
        throw Error(`StartTurn expects single target, got ${pack.Targets}`);
    }

    let currentPlayer = pack.Targets[0];
    let priority = NewPlayerPriorityEvent(currentPlayer);

    let rolls = [0, 0];
    getRNGContext(state, (rng) => {
        rolls = rolls.map(() => rng.nextInt(1, 6));
    });
    let move = NewMoveEvent(currentPlayer, rolls);

    // Suffix is either going to be an additional turn
    // from rolling 'doubles' or an endTurn.
    //
    // TODO: handle sending straight to jail.
    let suffix = [];
    if (RollsAllSame(rolls)) {
        suffix.push(NewStartTurnEvent(currentPlayer));
    }else {
        let endTurn = NewEndTurnEvent(currentPlayer);
        suffix.push(endTurn);
    }

    let added = [...suffix, priority, move];
    state.stack.push(...added);

    state.currentTurn = currentPlayer;

    return state;
};

export const Self = 'start-turn';

export const Desc = {
    Op, Self,
} as IEffectDescription;

export default Desc;

export function NewStartTurnEvent(player: EntityCode): IEvent {
    return {
        Effects: [
            {
                Source: GlobalStateEntityCode,
                Targets: [player],
                TargetType: Players.TargetTypes.Player,
                Effect: Self,
            },
        ],
    };
}

/**
 * RollsAllSame returns whether all entries in the provided array of
 * rolls is the same. O(n)
 */
export function RollsAllSame(rolls: Array<number>): boolean {
    return rolls.every((roll, i) => {
        if (i === 0) return true;
        return rolls[i - 1] === roll;
    });
}
