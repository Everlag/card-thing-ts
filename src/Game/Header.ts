import {
    IEvent,
} from '../Event/Header';
import {
    IPlayer, PlayerBehavior,
} from '../Player/Header';
import {
    IEntity, EntityCode,
} from '../Entity/Header';
import { IAsInterceptor } from '../Entity/Entities/AsInterceptor';

export enum Phase {
    DuringTurn = 'during-turn',
    EndOfTurn = 'end-of-turn',
    StartOfTurn = 'start-of-turn',
}

export interface IGameStack {
    push(...events: Array<IEvent>): void;

    pop(): IEvent | null;

    contents(): Array<IEvent>;
}

export interface IGameState {
    seed: number;
    phase: Phase;
    stack: IGameStack;
    interceptors: Array<IAsInterceptor>;
    players: Array<IPlayer>;
    currentTurn: EntityCode;
}

// IPlayerInit is used to initialize a player for
// use in an IGameState
export interface IPlayerInit {
    Self: IEntity;
    Behavior: PlayerBehavior;
}
