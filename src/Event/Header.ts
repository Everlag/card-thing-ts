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

/**
 * IEffectFilter allows IEffectPacks to be conditionally matched on by
 * describing their shape.
 */
export interface IEffectPackFilter {
    Source?: EntityCode;
    /**
     * If any of the targets listed here are included
     * in theIEffectPack, this is considered a match.
     */
    Targets?: Array<EntityCode>;
    TargetType?: TargetType;
    Effect?: Effect;

    /**
     * Null matches if and only if the provided IEffectPack
     * is actually null. This is a special case.
     */
    Null?: boolean;
}

export enum EffectMutator {
    Redirect = 'redirect',
    Cancel = 'cancel',
}

/**
 * IEffectPackMutator modifies an IEffectPack using some predefined method.
 *
 * Typical usage is to bundle this is an IEffectPackFilter to conditionally
 * modify only matched IEffectPack.
 *
 * '$PLAYER cannot be damaged' can be simulated using a combination of
 * IEffectPackFilter -> {Targets: [$PLAYER], Effect: Effect.Damage}
 * IEffectPackMutator -> {Mutator: EffectMutator.Cancel}
 * Of course, all IEffectPacks to be executed would need to be passed
 * through all of the filters.
 */
export interface IEffectPackMutator {
    Mutator: EffectMutator;

    // Allow properties not specifically declared here to be included
    // on literals which will allow them to satisfy interfaces
    // inheriting this interface.
    [others: string]: any;
}

export class EffectPackMutatorAssertError extends Error {
    constructor(desired: String, got: EffectMutator) {
        super(`cannot cast ${got} IEffectPackMutator to ${desired}`);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, EffectPackMutatorAssertError.prototype);
    }
}

function EffectPackMutatorAssertFail(desired: String, got: EffectMutator): EffectPackAssertError {
    return new EffectPackMutatorAssertError(desired, got);
}

export type IEffectPackMutatorAssert = (e: IEffectPackMutator) => IEffectPackMutator;

export enum RedirectMutatorDirection {
    ToSource = 'to-source',
    ToOthers = 'to-others',
}
export interface IRedirectMutator extends IEffectPackMutator {
    Direction: RedirectMutatorDirection;

    Others?: Array<EntityCode>;
}
export function AsRedirect(e: IEffectPackMutator): IRedirectMutator {
    if (e.Mutator !== EffectMutator.Redirect) {
        throw EffectPackMutatorAssertFail(EffectMutator.Redirect,
            e.Mutator);
    }
    return e as IRedirectMutator;
}
