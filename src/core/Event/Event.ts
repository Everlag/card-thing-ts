import {
    EntityCode, GlobalStateEntityCode,
} from '../Entity/Header';
import {
    IEvent,
    IEffectPackFilter, IEffectPackMutator,
} from './Header';
import Global from '../Zone/Zones/Global';

import EndTurn from './Effects/EndTurn';
export const EndTurnEvent: IEvent = {
    Effects: [
        {
            Source: GlobalStateEntityCode,
            Targets: [GlobalStateEntityCode],
            TargetType: Global.TargetTypes.Global,
            Effect: EndTurn.Self,
        },
    ],
};

import StartTurn from './Effects/StartTurn';
export function NewStartTurnEvent(player: EntityCode): IEvent {
    return {
        Effects: [
            {
                Source: GlobalStateEntityCode,
                Targets: [player],
                TargetType: Global.TargetTypes.Global,
                Effect: StartTurn.Self,
            },
        ],
    };
}

export function NewEndTurnEvent(player: EntityCode): IEvent {
    return {
        Effects: [
            {
                Source: GlobalStateEntityCode,
                Targets: [player],
                TargetType: Global.TargetTypes.Global,
                Effect: EndTurn.Self,
            },
        ],
    };
}

import PlayerPriority from './Effects/PlayerPriority';
export function NewPlayerPriorityEvent(player: EntityCode): IEvent {
    return {
        Effects: [
            {
                Source: GlobalStateEntityCode,
                Targets: [player],
                TargetType: Global.TargetTypes.Global,
                Effect: PlayerPriority.Self,
            },
        ],
    };
}

import ThrowGuard from './Effects/ThrowGuard';
export function NewThrowGuardEvent(): IEvent {
    return {
        Effects: [
            {
                Source: GlobalStateEntityCode,
                Targets: [GlobalStateEntityCode],
                TargetType: Global.TargetTypes.Global,
                Effect: ThrowGuard.Self,
            },
        ],
    };
}

import SetIntercept,
    { ISetInterceptorEffectPack } from './Effects/SetIntercept';
export function NewSetInterceptEvent(source: EntityCode,
    filter: IEffectPackFilter, mutator: IEffectPackMutator,
    expiry?: IEffectPackFilter): IEvent {

    return {
        Effects: [
            {
                Source: source,
                Targets: [GlobalStateEntityCode],
                TargetType: Global.TargetTypes.Global,
                Effect: SetIntercept.Self,
                Filter: filter,
                Mutator: mutator,
                Expiry: expiry,
            } as ISetInterceptorEffectPack,
        ],
    };
}

import RemoveIntercept,
    { IRemoveInterceptorEffectPack } from './Effects/RemoveIntercept';
import Interceptors from '../Zone/Zones/Interceptors';
export function NewRemoveInterceptEvent(source: EntityCode, target: EntityCode,
    mustMatch: 'all' | 'some' | undefined): IEvent {

    return {
        Effects: [
            {
                Source: source,
                Targets: [target],
                TargetType: Interceptors.TargetTypes.Interceptor,
                Effect: RemoveIntercept.Self,
                MustMatch: mustMatch,
            } as IRemoveInterceptorEffectPack,
        ],
    };
}
