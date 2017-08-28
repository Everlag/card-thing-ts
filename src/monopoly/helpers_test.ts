import { IPlayerInit, IGameState } from '../core/Game/Header';
import { GameState } from '../core/Game/Game';
import { WithPosition } from './Entities/WithPosition';
import { WithMoney } from './Entities/WithMoney';
import { TileEntityFromData } from './Entities/DataTransform';
import Tiles from './Zones/Tiles';
import { MutData } from './data';
import {
    GetDefaultPlayersWithMods,
} from '../core/test';

/**
 * GetMonopolyPlayers returns the usual default players
 * mutated to satisfy the conditions required of players in Monopoloy.
 */
function GetMonopolyPlayers(): Array<IPlayerInit> {
    return GetDefaultPlayersWithMods(
        // Satisfy WithPosition
        (init: IPlayerInit) => {
            init.Self.HasPosition = true;
            init.Self.Position = 0;
            WithPosition(init.Self); // Asssert
            return init;
        },
        // Satisfy WithMoney
        (init: IPlayerInit) => {
            init.Self.HasMoney = true;
            init.Self.Money = 0;
            WithMoney(init.Self); // Asssert
            return init;
        },
    );
}

/**
 * GetPreparedGameState returns a GameState where valid
 * monopoloy players have been registered and all tiles from
 * the data are present.
 */
export function GetPreparedGameState(): IGameState {
    let playerInit = GetMonopolyPlayers();
    let state = new GameState(playerInit);

    // Register our tiles
    MutData().properties.forEach(p => {
        let e = TileEntityFromData(p, state);

        Tiles.Add(e, state);
    });

    return state;
}

/**
 * ForceDoubles enforces that the next set of rolls nextInt(1,6)
 * performed against the provided GameState will result in doubles.
 *
 * Constrains
 * - nextInt(1,6) is the function being used
 * - doubles implies a roll size of two dice.
 * @param state GameState to be modified
 */
export function ForceDoubles(state: IGameState): IGameState {
    // NOTE: this doublesSeed is tied to the rng.
    //       If the underlying RNG implementation is changed, this will
    //       need to be regenerated.
    //
    // This was manually computed by brute forcing a doubles roll.
    const doublesSeed = 136014;

    state.seed = doublesSeed;

    return state;
}
