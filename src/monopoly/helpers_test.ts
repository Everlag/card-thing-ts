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

import { EntityCode, GlobalStateEntityCode } from '../core/Entity/Header';
import { IAsInterceptor } from '../core/Entity/Entities/AsInterceptor';
import Players from '../core/Zone/Zones/Players';
import Affix, {
    IAffixMutator, AffixMutatorPlacment,
} from '../core/Event/Mutators/Affix';
import Move from './Effects/Move';
import Pay, { IPayEffectPack } from './Effects/Pay';
function PassesGoInterceptor(identity: EntityCode): IAsInterceptor {
    return {
        Identity: identity,

        IsInterceptor: true,
        foo: true,

        Filter: {
            Effect: Move.Self,
            PassesGo: true,
        },

        Mutator: {
            Mutator: Affix.Self,
            Placement: AffixMutatorPlacment.After,

            Others: [
                {
                    Effect: Pay.Self,

                    Source: GlobalStateEntityCode,
                    Targets: ['$replaced$'],
                    TargetType: Players.TargetTypes.Player,

                    Amount: 200,

                    Replacements: ['Targets'],
                } as IPayEffectPack,
            ],
        } as IAffixMutator,

    } as IAsInterceptor;
}

import Interceptors from '../core/Zone/Zones/Interceptors';

/**
 * GetPreparedGameState returns a GameState where valid
 * monopoloy players have been registered and all tiles from
 * the data are present.
 *
 * @param includeRules defines whether rule-enforcing interceptors are
 *                     are included on the returned state.
 *                     This is optional to allow small tests to avoid having
 *                     to import many unrelated Effects/Filters to register.
 */
export function GetPreparedGameState(includeRules: boolean): IGameState {
    let playerInit = GetMonopolyPlayers();
    let state = new GameState(playerInit);

    // Register our tiles
    MutData().properties.forEach(p => {
        let e = TileEntityFromData(p, state);

        Tiles.Add(e, state);
    });

    // Early exit if they don't want rules declared.
    // This prevents them from having to register a whole bunch of
    // potentially unnecessary filters and effects.
    if (!includeRules) return state;

    let passGo = PassesGoInterceptor('foobar');
    Interceptors.Add(passGo, state);

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
