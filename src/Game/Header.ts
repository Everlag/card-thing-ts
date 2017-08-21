import {
    IEvent,
} from '../Event/Header';
import {
    PlayerBehavior,
} from '../Player/Header';
import {
    IEntity, EntityCode,
} from '../Entity/Header';
import { IZoneCollection, IEntityCollection } from '../Zone/Header';

export interface IGameStack {
    push(...events: Array<IEvent>): void;

    pop(): IEvent | null;

    contents(): Array<IEvent>;
}

export interface IGameState {
    seed: number;
    stack: IGameStack;
    zones: IZoneCollection;
    entities: IEntityCollection;
    currentTurn: EntityCode;
}

// IPlayerInit is used to initialize a player for
// use in an IGameState
export interface IPlayerInit {
    Self: IEntity;
    Index: number;
    Behavior: PlayerBehavior;
}
