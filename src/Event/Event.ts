import {
    EntityCode, GlobalStateEntityCode,
} from '../Entity/Header';
import {
    IEvent, TargetType,
    IEffectPackFilter, IEffectPackMutator,
} from './Header';

import EndTurn from './Effects/EndTurn';
export const EndTurnEvent: IEvent = {
    Effects: [
        {
            Source: GlobalStateEntityCode,
            Targets: [GlobalStateEntityCode],
            TargetType: TargetType.Global,
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
                TargetType: TargetType.Global,
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
                TargetType: TargetType.Global,
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
                TargetType: TargetType.Global,
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
                TargetType: TargetType.Global,
                Effect: ThrowGuard.Self,
            },
        ],
    };
}

import SetIntercept,
    { ISetInterceptorEffectPack } from './Effects/SetIntercept';
export function NewSetInterceptEvent(source: EntityCode,
    filter: IEffectPackFilter, mutator: IEffectPackMutator): IEvent {

    return {
        Effects: [
            {
                Source: source,
                Targets: [GlobalStateEntityCode],
                TargetType: TargetType.Global,
                Effect: SetIntercept.Self,
                Filter: filter,
                Mutator: mutator,
            } as ISetInterceptorEffectPack,
        ],
    };
}

import RemoveIntercept,
    { IRemoveInterceptorEffectPack } from './Effects/RemoveIntercept';
export function NewRemoveInterceptEvent(source: EntityCode, target: EntityCode,
    mustMatch: string): IEvent {

    return {
        Effects: [
            {
                Source: source,
                Targets: [target],
                TargetType: TargetType.Interceptor,
                Effect: RemoveIntercept.Self,
                MustMatch: mustMatch,
            } as IRemoveInterceptorEffectPack,
        ],
    };
}
