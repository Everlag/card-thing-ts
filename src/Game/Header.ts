import {
    IEvent, IEffectPackFilter, IEffectPackMutator,
} from '../Event/Header';
import {
    IPlayer, PlayerBehavior,
} from '../Player/Header';
import {
    IEntity, EntityCode,
} from '../Entity/Header';

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
    phase: Phase;
    stack: IGameStack;
    interceptors: Array<IEffectInterceptor>;
    players: Array<IPlayer>;
    currentTurn: EntityCode;
}

// IPlayerInit is used to initialize a player for
// use in an IGameState
export interface IPlayerInit {
    Self: IEntity;
    Behavior: PlayerBehavior;
}

/**
 * IEventInterceptor conditionally applies Mutator to all
 * IEffectPacks matched by Filter.
 */
export interface IEffectInterceptor {
    Filter: IEffectPackFilter;
    Mutator: IEffectPackMutator;
}
