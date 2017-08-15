import {
    TargetType, IEvent, IEffectPack, Effect,

    AsDamage, AsInterceptor,
} from './Header';
import {
    NewEndTurnEvent, NewStartTurnEvent, NewPlayerPriorityEvent,
} from './Event';
import {
    IGameState,
} from '../Game/Header';
import {
    getPlayerIndex, getRNGContext,
} from '../Game/Game';
import {
    GetPlayerResponse,
} from '../Player/Player';
import {
    PlayerAction, PlayerResponseQuery,
} from '../Player/Header';
import {
    EntityCode,

    AsWithHealth,
    IAsInterceptor,
} from '../Entity/Header';
import {
    NewEntityCode,
} from '../Entity/EntityCode';

type EffectOperator = (state: IGameState,
    pack: IEffectPack, remoteQuery: PlayerResponseQuery) => IGameState;
let operatorRegister = new Map<Effect, EffectOperator>();

// getPriorities returns an array of IEvent which will
// give every player priority.
function getPriorities(state: IGameState): Array<IEvent> {
    return state.players
        .map(p => NewPlayerPriorityEvent(p.Self.Identity));
}

operatorRegister.set(Effect.StartTurn,
    (state: IGameState, pack: IEffectPack) => {
        if (pack.Targets.length !== 1) {
            throw Error(`StartTurn expects single target, got ${pack.Targets}`);
        }

        let currentPlayer = pack.Targets[0];
        let endTurn = NewEndTurnEvent(currentPlayer);

        state.stack.push(...getPriorities(state), endTurn);

        state.currentTurn = currentPlayer;

        return state;
    });

operatorRegister.set(Effect.EndTurn,
    (state: IGameState, pack: IEffectPack) => {
        if (pack.Targets.length !== 1) {
            throw Error(`EndTurn expects single target, got ${pack.Targets}`);
        }

        // Set a StartTurn
        let currentPlayerIndex = getPlayerIndex(state, pack.Targets[0]);
        let nextPlayerIndex = (currentPlayerIndex + 1) % state.players.length;
        let nextPlayer = state.players[nextPlayerIndex];
        let startTurn = NewStartTurnEvent(nextPlayer.Self.Identity);

        state.stack.push(startTurn);

        return state;
    });

operatorRegister.set(Effect.PlayerPriority,
    (state: IGameState, pack: IEffectPack, remoteQuery: PlayerResponseQuery) => {
        if (pack.Targets.length !== 1) {
            throw Error(`EndTurn expects single target, got ${pack.Targets}`);
        }

        let response = GetPlayerResponse(pack.Targets[0], state, remoteQuery);

        switch (response.Action) {
            case PlayerAction.Pass:
                return state;
            case PlayerAction.Use:
                // Since IPlayerResponse is just an IEvent with
                // a flag, we can simply push it onto the stack.
                //
                // We also give all players the opportunity to react.
                state.stack.push(...getPriorities(state), response);
                return state;
            default:
                throw Error(`unknown PlayerAction in response, got: ${response.Action}`);
        }
    });

operatorRegister.set(Effect.Damage,
    (state: IGameState, pack: IEffectPack, remoteQuery: PlayerResponseQuery) => {
        if (pack.Targets.length !== 1) {
            throw Error(`Damage expects single target, got ${pack.Targets}`);
        }

        let damagePack = AsDamage(pack);

        // Eventually, this will be a switch/if-elif-else
        // but for now we'll enjoy an early exit
        if (damagePack.TargetType !== TargetType.Player) {
            throw Error(`unknown TargetType for Damage: ${pack.TargetType}`);
        }

        let playerIndex = getPlayerIndex(state, damagePack.Targets[0]);
        let player = state.players[playerIndex];

        let entity = AsWithHealth(player.Self);
        entity.Health -= damagePack.Damage;

        return state;
    });

operatorRegister.set(Effect.SetIntercept,
    (state: IGameState, pack: IEffectPack, remoteQuery: PlayerResponseQuery) => {
        if (pack.Targets.length !== 1) {
            throw Error(`SetInterceptg expects single target, got ${pack.Targets}`);
        }

        let interceptorPack = AsInterceptor(pack);

        if (interceptorPack.TargetType !== TargetType.Global) {
            throw Error(`unknown TargetType for SetIntercept: ${pack.TargetType}`);
        }

        // Fetch an EntityCode
        //
        // We require a dummy assignment as a result of the
        // use of a callback to access the RNG context.
        let identity: EntityCode = '';
        getRNGContext(state, (rng) => {
            identity = NewEntityCode(rng);
        });

        let interceptor: IAsInterceptor = {
            Identity: identity,

            IsInterceptor: true,
            Filter: interceptorPack.Filter,
            Mutator: interceptorPack.Mutator,
        };

        state.interceptors.push(interceptor);

        return state;
    });

// ApplyEffect applies the given Effect to the IGameState and returns it.
export function ApplyEffect(effect: IEffectPack,
    state: IGameState, remoteQuery: PlayerResponseQuery): IGameState {

    let op = operatorRegister.get(effect.Effect);
    if (!op) {
        throw Error(`cannot apply unregistered effect "${effect.Effect}"`);
    }

    return op(state, effect, remoteQuery);
}
