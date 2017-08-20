import { EntityCode } from '../Entity/Header';
import { IGameState } from '../Game/Header';
import { PlayerResponseQuery } from '../Player/Header';
import { TargetType } from '../Zone/Header';

export type EffectOperator = (state: IGameState,
    pack: IEffectPack, remoteQuery: PlayerResponseQuery) => IGameState;

export interface IEffectDescription {
    Self: Effect;
    Op: EffectOperator;
}

export type Effect = string;

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
    constructor(desired: String, got: string) {
        super(`cannot cast ${got} IEffectPack to ${desired}`);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, EffectPackAssertError.prototype);
    }
}

export function EffectPackAssertFail(desired: String,
    got: string): EffectPackAssertError {

    return new EffectPackAssertError(desired, got);
}

export type IEffectPackAssert = (e: IEffectPack) => IEffectPack;

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

export type EffectMutator = string;

/**
 * Mutator is an operation associated with a specific EffectMutator.
 *
 * This performs the actual mutation of the IEffectPack.
 * The given IEffectPack should never be mutated, instead it should be
 * copied and returned.
 *
 * IEffectPackMutator is included as an argument as it may be extended
 *
 * A Mutator may return an explicitly null result to indicate the
 * IEffectPack should not be applied.
 */
export type Mutator = (pack: IEffectPack,
    mutator: IEffectPackMutator) => Array<IEffectPack | null>;

export interface IMutatorDescription {
    Self: EffectMutator;
    Op: Mutator;
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

export function EffectPackMutatorAssertFail(desired: String,
    got: EffectMutator): EffectPackAssertError {

    return new EffectPackMutatorAssertError(desired, got);
}

export type IEffectPackMutatorAssert = (e: IEffectPackMutator) => IEffectPackMutator;
