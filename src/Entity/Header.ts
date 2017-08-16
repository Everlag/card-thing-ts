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

    // Allow properties which weren't specifically defined here to
    // be declared on literals.
    //
    // This also allows runtime assertions for the correctness of
    // casts to interfaces extending this.
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

export function EntityAssertFail(desired: String,
    flag: String): EntityAssertError {

    return new EntityAssertError(desired, flag);
}
