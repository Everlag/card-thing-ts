import {
    IGameStack, IGameState, IPlayerInit, Phase,
} from './Header';
import {
    IEvent,
} from '../Event/Header';
import {
    EntityCode,
} from '../Entity/Header';
import {
    IPlayer,
} from '../Player/Header';

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

function IPlayerInitToPlayer(init: IPlayerInit): IPlayer {
    return {
        Self: init.Self,
        Behavior: init.Behavior,
    };
}

export class GameState implements IGameState {
    public players: Array<IPlayer>;

    public phase: Phase;

    public stack: IGameStack = new GameStack();

    public currentTurn: EntityCode;

    constructor(players: Array<IPlayerInit>,
        phase = Phase.StartOfTurn) {
        if (players.length < 2) throw Error('need at least two players');
        this.players = players.map(p => IPlayerInitToPlayer(p));

        // CurrentTurn defaults to the first player entered into the state
        this.currentTurn = this.players[0].Self.Identity;

        this.phase = phase;
    }
}

// getPlayerIndex returns the index of a player in the players
// array of the state.
export function getPlayerIndex(s: IGameState, previous: EntityCode): number {
    let index = s.players.findIndex((p) => p.Self.Identity === previous);
    if (index === -1) throw Error(`cannot find unknown player ${previous}`);
    return index;
}
