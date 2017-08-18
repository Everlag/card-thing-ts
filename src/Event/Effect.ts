import {
    IEffectDescription, EffectOperator, IEvent, IEffectPack,
} from './Header';
import {
    NewPlayerPriorityEvent,
} from './Event';
import {
    IGameState,
} from '../Game/Header';
import {
    PlayerResponseQuery,
} from '../Player/Header';

let operatorRegister = new Map<string, EffectOperator>();

export function RegisterEffect(desc: IEffectDescription) {
    if (operatorRegister.has(desc.Self)) {
        throw Error(`duplicated identifier for ${desc.Self}`);
    }
    operatorRegister.set(desc.Self, desc.Op);
    console.log('operator register looks like', operatorRegister);
}

// getPriorities returns an array of IEvent which will
// give every player priority.
export function getPriorities(state: IGameState): Array<IEvent> {
    return state.players
        .map(p => NewPlayerPriorityEvent(p.Identity));
}

import ThrowGuard from './Effects/ThrowGuard';
RegisterEffect(ThrowGuard);

import StartTurn from './Effects/StartTurn';
RegisterEffect(StartTurn);

import EndTurn from './Effects/EndTurn';
RegisterEffect(EndTurn);

import PlayerPriority from './Effects/PlayerPriority';
RegisterEffect(PlayerPriority);

import Damage from './Effects/Damage';
RegisterEffect(Damage);

import SetIntercept from './Effects/SetIntercept';
RegisterEffect(SetIntercept);

import RemoveIntercept from './Effects/RemoveIntercept';
RegisterEffect(RemoveIntercept);

// ApplyEffect applies the given Effect to the IGameState and returns it.
export function ApplyEffect(effect: IEffectPack,
    state: IGameState, remoteQuery: PlayerResponseQuery): IGameState {

    let op = operatorRegister.get(effect.Effect);
    if (!op) {
        throw Error(`cannot apply unregistered effect "${effect.Effect}"`);
    }

    return op(state, effect, remoteQuery);
}
