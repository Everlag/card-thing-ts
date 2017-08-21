import {
    IEffectRegister,
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
import { GetPlayerByIndex, GetPlayerCount } from '../Zone/Zones/Players';

let coreRegister: IEffectRegister = {
    Register: new Map<string, EffectOperator>(),
};

/**
 * RegisterEffect includes the described Effect on the register
 */
export function RegisterEffect(register: IEffectRegister,
    desc: IEffectDescription) {

    if (register.Register.has(desc.Self)) {
        throw Error(`duplicated identifier for ${desc.Self}`);
    }
    register.Register.set(desc.Self, desc.Op);
}

// getPriorities returns an array of IEvent which will
// give every player priority.
export function getPriorities(state: IGameState): Array<IEvent> {
    // TODO: handle possibility of players being removed from the
    //       the state. This relies on every player always existing and
    //       their being indexed as monotonically increasing from 0.
    let count = GetPlayerCount(state);
    return Array.from(new Array(count)).map((_, i) => {
        let identity = GetPlayerByIndex(i, state).Identity;
        return NewPlayerPriorityEvent(identity);
    });
}

import ThrowGuard from './Effects/ThrowGuard';
RegisterEffect(coreRegister, ThrowGuard);

import StartTurn from './Effects/StartTurn';
RegisterEffect(coreRegister, StartTurn);

import EndTurn from './Effects/EndTurn';
RegisterEffect(coreRegister, EndTurn);

import PlayerPriority from './Effects/PlayerPriority';
RegisterEffect(coreRegister, PlayerPriority);

import Damage from './Effects/Damage';
RegisterEffect(coreRegister, Damage);

import SetIntercept from './Effects/SetIntercept';
RegisterEffect(coreRegister, SetIntercept);

import RemoveIntercept from './Effects/RemoveIntercept';
RegisterEffect(coreRegister, RemoveIntercept);

/**
 * NewEffectRegister constructs an EffectRegister with all
 * core operations already registered.
 */
export function NewEffectRegister(): IEffectRegister {
    let register: IEffectRegister = {
        Register: new Map(),
    };

    coreRegister.Register
        .forEach((op, effect) => register.Register.set(effect, op));

    return register;
}

// ApplyEffect applies the given Effect to the IGameState and returns it.
export function ApplyEffect(register: IEffectRegister,
    effect: IEffectPack,
    state: IGameState, remoteQuery: PlayerResponseQuery): IGameState {

    let op = register.Register.get(effect.Effect);
    if (!op) {
        throw Error(`cannot apply unregistered effect "${effect.Effect}"`);
    }

    return op(state, effect, remoteQuery);
}
