import {
    IEffectDescription, EffectOperator,
    TargetType, IEvent, IEffectPack, Effect, AsRemoveInterceptor,
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
        .map(p => NewPlayerPriorityEvent(p.Self.Identity));
}

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

operatorRegister.set(Effect.RemoveIntercept,
    (state: IGameState, pack: IEffectPack, remoteQuery: PlayerResponseQuery) => {
        if (pack.Targets.length < 1) {
            throw Error(`RemoveIntercept expects at least one target, got ${pack.Targets}`);
        }

        let interceptorPack = AsRemoveInterceptor(pack);

        if (interceptorPack.TargetType !== TargetType.Interceptor) {
            throw Error(`unknown TargetType for RemoveIntercept: ${pack.TargetType}`);
        }

        // Validate targets existence.
        let someMatch = false;
        let allMatch = true;
        pack.Targets.forEach(t => {
            let found = state.interceptors.some(intercept => {
                return intercept.Identity === t;
            });
            someMatch = found || someMatch;
            allMatch = found && allMatch;
        });
        switch (interceptorPack.MustMatch) {
            case 'all':
                if (!allMatch) {
                    throw Error(`failed to match all targets when required
                    ${JSON.stringify(pack)}`);
                }
                break;
            case 'some':
            if (!someMatch) {
                throw Error(`failed to match any targets when required
                    ${JSON.stringify(pack)}`);
                }
                break;
            case undefined:
                break;
            default:
                throw Error('fell through exhaustive MustMatch switch');
        }

        // Remove targets
        state.interceptors = state.interceptors
            .filter(i => {
                return !pack.Targets.some(target => target === i.Identity);
            });

        return state;
    });

// ApplyEffect applies the given Effect to the IGameState and returns it.
export function ApplyEffect(effect: IEffectPack,
    state: IGameState, remoteQuery: PlayerResponseQuery): IGameState {

    let op = operatorRegister.get(effect.Effect);
    if (!op) {
        throw Error(`cannot apply unregistered effect "${effect.Effect}"`);
    }

    return op(state, effect, remoteQuery);
}
