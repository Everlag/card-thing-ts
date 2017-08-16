import {
    EntityCode, GlobalStateEntityCode,
} from '../Entity/Header';
import {
    IEvent, TargetType,
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
