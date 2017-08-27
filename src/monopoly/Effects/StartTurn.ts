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

import Global from '../../core/Zone/Zones/Global';

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
    let endTurn = NewEndTurnEvent(currentPlayer);
    let priority = NewPlayerPriorityEvent(currentPlayer);

    let rolls = [0, 0];
    getRNGContext(state, (rng) => {
        rolls = rolls.map(() => rng.nextInt(1, 6));
    });
    let move = NewMoveEvent(currentPlayer, rolls);

    let added = [endTurn, priority, move];
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
                TargetType: Global.TargetTypes.Global,
                Effect: Self,
            },
        ],
    };
}
