import {
    IEffectPackFilter, IEffectPackMutator,
} from '../Event/Header';

export type EntityCode = String;

// GlobalStateEntityCode is the reserved EntityCode assigned
// to modfying GlobalState.
export const GlobalStateEntityCode: EntityCode = '6l0b4l';

// IEntity represents an addressable object inside the game.
//
// Typically, an EntityCode is used to reference this IEntity.
//
// IEntity represents baseline interface for an Entity. Typically,
// type guards are applied to allow the use of interfaces extending IEntity.
export interface IEntity {
    Identity: EntityCode;

    // Type flags are present here to allow runtime assertion
    // of correctness of casts.
    //
    // Flags are optional to be included, hence them being truthy
    // implies that their associated extension of IEntity is valid.
    HasHealth?: boolean;
    IsInterceptor?: boolean;

    // Allow properties which weren't specifically defined here to
    // be declared on literals.
    //
    // https://stackoverflow.com/a/31816062
    [others: string]: any;
}

class EntityAssertError extends Error {
    constructor(desired: String, flag: String) {
        super(`cannot cast IEntity to ${desired} with falsey ${flag}`);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, EntityAssertError.prototype);
    }
}

function EntityAssertFail(desired: String, flag: String): EntityAssertError {
    return new EntityAssertError(desired, flag);
}

export interface IWithHealth extends IEntity {
    Health: number;

    HasHealth: true;
}
export function AsWithHealth(e: IEntity): IWithHealth {
    if (!e.HasHealth) throw EntityAssertFail('IWithHealth', 'HasHealth');
    return e as IWithHealth;
}

export interface IAsInterceptor extends IEntity {
    IsInterceptor: true;

    Filter: IEffectPackFilter;
    Mutator: IEffectPackMutator;
}
export function AsInterceptor(e: IEntity): IAsInterceptor {
    if (!e.IsInterceptor) throw EntityAssertFail('IAsInterceptor', 'IsInterceptor');
    return e as IAsInterceptor;
}
