import { IPlayerInit, IGameState } from '../core/Game/Header';
import { GameState } from '../core/Game/Game';
import { WithPosition } from './Entities/WithPosition';
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
