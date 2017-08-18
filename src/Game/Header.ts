import {
    IEvent,
} from '../Event/Header';
import {
    PlayerBehavior,
} from '../Player/Header';
import {
    IEntity, EntityCode,
} from '../Entity/Header';
import { IAsPlayer } from '../Entity/Entities/AsPlayer';
import { IZoneCollection } from '../Zone/Header';
import { IAsInterceptor } from '../Entity/Entities/AsInterceptor';

export interface IGameStack {
    push(...events: Array<IEvent>): void;

    pop(): IEvent | null;

    contents(): Array<IEvent>;
}

export interface IGameState {
    seed: number;
    stack: IGameStack;
    interceptors: Array<IAsInterceptor>;
    players: Array<IAsPlayer>;
    zones: IZoneCollection;
    currentTurn: EntityCode;
}

// IPlayerInit is used to initialize a player for
// use in an IGameState
export interface IPlayerInit {
    Self: IEntity;
    Index: number;
    Behavior: PlayerBehavior;
}
