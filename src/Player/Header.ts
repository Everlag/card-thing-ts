import {
    IEvent,
} from '../Event/Header';
import {
    IGameState,
} from '../Game/Header';
import {
    IEntity, EntityCode,
} from '../Entity/Header';

export interface IPlayer {
    Self: IEntity;
    Behavior: PlayerBehavior;
}

export enum PlayerAction {
    // The player passes priority. NOP
    Pass = 'pass-priority',
    // The player executes the Effects.
    Use = 'use-priority',
}

// IPlayerEvent is an IEvent representing a
// Player response to receiving priority.
export interface IPlayerResponse extends IEvent {
    Action: PlayerAction;
}

// PlayerActionQuery generates IPlayerEvent when
// requested based on the state from the view
// of the specific player.
export type PlayerResponseQuery = (player: EntityCode,
    state: IGameState) => IPlayerResponse;

export enum PlayerBehavior {
    // AlwaysFail will throw an Error if it is queried for a response.
    //
    // This can is useful for tests where players need to exist
    // but should never be given the opportunity to respond..
    AlwaysFail = 'always-fail',
    // AlwaysPass will always return a response
    AlwaysPass = 'always-pass',
    // Query will always ask the machine for a player response.
    Query = 'always-query',
}
