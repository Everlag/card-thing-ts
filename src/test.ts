import { EntityCode } from './Entity/Header';
import { IPlayerInit } from './Game/Header';
import { PlayerBehavior } from './Player/Header';

// Expect tests that the serialized expected and got will be equivalent
// If not equivalent, we throw either the providied message or a generic error.
//
// This is best-effort equality based on serialization.
export function ExpectToEqual(expected: any, got: any,
    msg: string | null = null): void {

    let expectedSerial = JSON.stringify(expected);
    let gotSerial = JSON.stringify(got);
    let match = expectedSerial === gotSerial;
    if (!match) {
        if (msg === null) msg = 'expected did not equal got';
        throw Error(`${msg}\nexpected:\n\t${expectedSerial}\ngot:\n\t${gotSerial}`);
    }
}

// stringify will pretty print the provided argument into a string
export function stringify(a: any): String {
    return JSON.stringify(a, null, 2);
}

/**
 * Test is a test case for proving GOAP's correctness.
 *
 * Tests are expected throw on failure and the harness
 * is expected to catch as necessary.
 */
export abstract class Test {
    public abstract Run(): void;

    public Name(): String {
        return (<any>this).constructor.name;
    }
}

export const PlayerOneEntityCode: EntityCode = 'f1r571';
export const PlayerTwoEntityCode: EntityCode = '53c0nd';
export const TertiaryPlayerEntityCode: EntityCode  = '73r7ry';
export const ExternalEntityCode: EntityCode =  '3Xrn4l';

export const PlayerDefaultHealth = 30;

function GetDefaultPlayerOne(): IPlayerInit {
    return {
        Self: {
            Identity: PlayerOneEntityCode,

            HasHealth: true,
            Health: PlayerDefaultHealth,
        },
        Index: 0,
        Behavior: PlayerBehavior.AlwaysPass,
    };
}

function GetDefaultPlayerTwo(): IPlayerInit {
    return {
        Self: {
            Identity: PlayerTwoEntityCode,

            HasHealth: true,
            Health: PlayerDefaultHealth,
        },
        Index: 1,
        Behavior: PlayerBehavior.AlwaysPass,
    };
};

function GetTertiaryPlayerThree(): IPlayerInit {
    return {
        Self: {
            Identity: TertiaryPlayerEntityCode,

            HasHealth: true,
            Health: PlayerDefaultHealth,
        },
        Index: 2,
        Behavior: PlayerBehavior.AlwaysPass,
    };
};

export function GetDefaultPlayers(): Array<IPlayerInit> {
    return [
        GetDefaultPlayerOne(),
        GetDefaultPlayerTwo(),
    ];
}

export const PlayerOneInit: IPlayerInit = GetDefaultPlayerOne();
Object.freeze(PlayerOneInit);

export const PlayerTwoInit: IPlayerInit = GetDefaultPlayerTwo();
Object.freeze(PlayerTwoInit);

export const PlayerTertiaryInit: IPlayerInit = GetTertiaryPlayerThree();
Object.freeze(PlayerTertiaryInit);

export const DefaultPlayers = GetDefaultPlayers();
Object.freeze(DefaultPlayers);

export type DefaultPlayerInitMod = (initial: IPlayerInit) => IPlayerInit;

// GetDefaultPlayersWithMods returns the default players with
// the provided DefaultPlayerInitMod applied.
//
// This follows the option pattern.
export function GetDefaultPlayersWithMods(...mods: Array<DefaultPlayerInitMod>): Array<IPlayerInit> {
    return GetDefaultPlayers().map(player => {
        return mods.reduce((p, m) => m(player), player);
    });
}

export function AlwaysQuery(initial: IPlayerInit): IPlayerInit {
    initial.Behavior = PlayerBehavior.Query;
    return initial;
}
