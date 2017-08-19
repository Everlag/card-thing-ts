import {
    IGameStack, IGameState, IPlayerInit,
} from './Header';
import {
    IEvent,
} from '../Event/Header';
import { EntityCode } from '../Entity/Header';
import { IAsInterceptor } from '../Entity/Entities/AsInterceptor';
import { IAsPlayer } from '../Entity/Entities/AsPlayer';
import { IZoneCollection } from '../Zone/Header';
import RNG from '../seeded_rng';

export class GameStack implements IGameStack {
    private stack = new Array<IEvent>();

    public push(...events: Array<IEvent>) {
        this.stack.push(...events);
    }

    public pop(): IEvent | null {
        let event = this.stack.pop();
        if (event === undefined) {
            return null;
        }
        return event;
    }

    public contents(): Array<IEvent> {
        return this.stack;
    }
}

export function IPlayerInitToPlayer(init: IPlayerInit): IAsPlayer {
    return {
        ...init.Self,
        IsPlayer: true,
        Index: init.Index,
        Behavior: init.Behavior,
    };
}

import Players from '../Zone/Zones/Players';

export class GameState implements IGameState {
    public seed: number;

    public players: Array<IAsPlayer>;

    public stack: IGameStack = new GameStack();

    public zones: IZoneCollection = {};

    public interceptors: Array<IAsInterceptor> = [];

    public currentTurn: EntityCode;

    constructor(players: Array<IPlayerInit>, seed = 0) {
        if (players.length < 2) throw Error('need at least two players');
        this.players = players.map(p => IPlayerInitToPlayer(p));

        players
            .map(p => IPlayerInitToPlayer(p))
            .forEach(p => Players.Add(p, this));

        // CurrentTurn defaults to the first player entered into the state
        this.currentTurn = this.players[0].Identity;

        this.seed = seed;
    }
}

// getPlayerIndex returns the index of a player in the players
// array of the state.
export function getPlayerIndex(s: IGameState, previous: EntityCode): number {
    let index = s.players.findIndex((p) => p.Identity === previous);
    if (index === -1) throw Error(`cannot find unknown player ${previous}`);
    return index;
}

/**
 * getRNGContext takes a callback to use a seeded RNG whose use
 * will update the seed on the provided GameState.
 * @param s GameState to be used and modified
 * @param op Operation to perform with the rng
 */
export function getRNGContext(s: IGameState, op: (rng: RNG) => void) {
    if (s.seed === undefined) {
        throw Error('cannot use getRNGContext with uninitialized seed');
    }
    let rng = new RNG(s.seed);
    op(rng);
    s.seed = rng.currentSeed;
}
