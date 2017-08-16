import {
    EntityCode, GlobalStateEntityCode,
} from '../Entity/Header';
import {
    IEvent, TargetType, Effect,
} from './Header';

export const EndTurnEvent: IEvent = {
    Effects: [
        {
            Source: GlobalStateEntityCode,
            Targets: [GlobalStateEntityCode],
            TargetType: TargetType.Global,
            Effect: Effect.EndTurn,
        },
    ],
};

import StartTurn from './StartTurn';
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
                Effect: Effect.EndTurn,
            },
        ],
    };
}

export function NewPlayerPriorityEvent(player: EntityCode): IEvent {
    return {
        Effects: [
            {
                Source: GlobalStateEntityCode,
                Targets: [player],
                TargetType: TargetType.Global,
                Effect: Effect.PlayerPriority,
            },
        ],
    };
}
