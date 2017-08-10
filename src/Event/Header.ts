import { EntityCode } from '../Entity/Header';

export enum Effect {
    // StartTurn pushes a PlayerPriority per-playerr
    // and an EndTurn for the next positional player.
    //
    // Target of StartTurn is the player whose turn
    // it is when this resolves.
    StartTurn = 'start-turn',
    // EndTurn pushes a StartTurn.
    //
    // Target of EndTurn is the player whose turn is currently
    // completing.
    EndTurn = 'end-turn',
    // PlayerPriority checks for a player response and handles
    // accordingly.
    //
    // Target of PlayerPriority is the player to query a response from.
    PlayerPriority = 'player-priority',

    // Damage removes a magnitude
    Damage = 'entity-damage',
}

export enum TargetType {
    Global = 'global',
    Player = 'player',
}

export interface IEffectPack {
    Source: EntityCode;
    Targets: Array<EntityCode>;
    TargetType: TargetType;
    Effect: Effect;

    // Allow properties which weren't specifically defined here to
    // be declared on literals.
    //
    // https://stackoverflow.com/a/31816062
    [others: string]: any;
}

export class EffectPackAssertError extends Error {
    constructor(desired: String, got: Effect) {
        super(`cannot cast ${got} IEffectPack to ${desired}`);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, EffectPackAssertError.prototype);
    }
}

function EffectPackAssertFail(desired: String, got: Effect): EffectPackAssertError {
    return new EffectPackAssertError(desired, got);
}

export type IEffectPackAssert = (e: IEffectPack) => IEffectPack;

export interface IDamageEffectPack extends IEffectPack {
    Damage: number;
}
export function AsDamage(e: IEffectPack): IDamageEffectPack {
    if (e.Effect !== Effect.Damage) {
        throw EffectPackAssertFail(Effect.Damage, e.Effect);
    }
    return e as IDamageEffectPack;
}

export interface IEvent {
    Effects: Array<IEffectPack>;
}
