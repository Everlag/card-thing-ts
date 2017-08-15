import {
    IEffectPack, IEffectDescription,
} from './Header';
import {
    NewEndTurnEvent,
} from './Event';
import {
    getPriorities,
    RegisterEffect,
} from './Effect';
import {
    IGameState,
} from '../Game/Header';

export function Op(state: IGameState, pack: IEffectPack) {
    if (pack.Targets.length !== 1) {
        throw Error(`StartTurn expects single target, got ${pack.Targets}`);
    }

    let currentPlayer = pack.Targets[0];
    let endTurn = NewEndTurnEvent(currentPlayer);

    state.stack.push(...getPriorities(state), endTurn);

    state.currentTurn = currentPlayer;

    return state;
};

export const Self = 'start-turn';

export const Desc = {
    Op, Self,
} as IEffectDescription;

RegisterEffect(Desc);