import { GameMachine } from './Game/Machine';
import { IGameState, IGameStack } from './Game/Header';
import { getPlayerIndex, GameStack } from './Game/Game';
import { IPlayerResponse, PlayerAction } from './Player/Header';
import {
    IEffectRegister, IMutatorRegister, IEffectFilterRegister,
    IEvent,
} from './Event/Header';
import {
    EntityCode,
} from './Entity/Header';

export type ResponseQueue = Map<EntityCode, IGameStack>;

// TestMachine implements a GameMachine whose player responses are of
// two types: pass or prepared action.
//
// A response queue map is provided. If a player does not have a key
// in that map, they always pass. Otherwise, that player will pop an
// action from the stack.
//
// Note: the effects will be taken off of the event and used to create
// a new event.
export class TestMachine extends GameMachine {
    constructor(public state: IGameState,
        public effectRegister: IEffectRegister,
        public filterRegister: IEffectFilterRegister,
        public mutatorRegister: IMutatorRegister,
        public responseQueue: ResponseQueue) {

        super(state, effectRegister, filterRegister, mutatorRegister);

        responseQueue.forEach((_, player) => {
            if (getPlayerIndex(state, player) === -1) {
                throw Error('unknown player in responseQueue');
            }
        });
    }

    public getPlayerResponse(player: EntityCode): IPlayerResponse {
        let stack = this.responseQueue.get(player);
        if (stack === undefined) return {
            Action: PlayerAction.Pass,
            Effects: new Array(),
        };

        let e = stack.pop();
        if (e === null) {
            throw Error(`empty response when qeuried for player ${player}`);
        }

        // TODO: less hack more respectful of types
        /* tslint:disable */
        let action = PlayerAction.Use;
        if ((<any>e)['Action']) {
            action = (<any>e)['Action'];
        }
        /* tslint:enable */

        return {
            Action: action,
            Effects: e.Effects,
        };
    }
}

// GetResponseQueue returns a response queue where each of the provided
// players will have an initialized stack ready to be filled.
export function GetResponseQueue(...players: Array<EntityCode>): ResponseQueue {
    return players.reduce((q, p) => {
        let stack = new GameStack();
        q.set(p, stack);
        return q;
    }, new Map<EntityCode, IGameStack>());
}

// AddResponsesToQueue takes the provided responses for a player and
// adds them to the queue to be executed.
//
// The player may not have any pre-exsiting responses, this will throw
// if resposnes are overwritten.
export function AddResponsesToQueue(player: EntityCode, queue: ResponseQueue,
    responses: Array<IEvent>) {

    let p = queue.get(player);
    if (p === undefined) throw Error('player not already included in queue');

    if (p.contents.length > 0) throw Error('player has pre-existing events');
    p.push(...responses);
}
