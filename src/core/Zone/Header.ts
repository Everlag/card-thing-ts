import { IEntity, EntityCode } from '../Entity/Header';
import { IWithZone } from '../Entity/Entities/WithZone';
import { IGameState } from '../Game/Header';

export type ZoneCode = string;

/**
 * IZoneCollection contains a number of Zones in a mapping
 * from their ZoneCode to their Zone object.
 */
export interface IZoneCollection {
    [Zone: string]: IZone;
}

/**
 * IEntityCollection holds Entities in a mapping
 * from their EntityCode to their Entity object.
 *
 * This allows efficient lookup of IEntities.
 * Iteration across an IEntityCollection is discouraged for
 * the performance impact it has.
 *
 * A Map would be used here if not for the fact that a map is not
 * trivially serializable through JSON.stringify/parse.
 */
export interface IEntityCollection {
    [Entity: string]: IWithZone;
}

/**
 * IZone contains Entities which have been placed within it.
 *
 * This is a dumb containter.
 *
 * Note: extensions to IZone can specify specific IEntity flavors
 * by providing wrapper accessor functions which perform the necessary
 * Entity As conversions.
 */
export interface IZone {
    Self: ZoneCode;

    // Count provides fast access to the number of Entities held
    // within the Zone.
    Count: number;
    // Ordered contains the EntityCodes for Entities existing in the Zone
    // in order of Add, with first-in, lowest-index semantics.
    Ordered: Array<EntityCode>;

    // Allow indexing into IZone so extensions of this interface
    // can perform assertions on it.
    [others: string]: any;
}

export type AddEntityOperator = (entity: IEntity, state: IGameState) => void;
export type GetEntityOperator = (identity: EntityCode, state: IGameState) => IEntity;
export type RemoveEntityOperator = (identity: EntityCode,
    state: IGameState) => IEntity | null;
export type OrderedEntititiesOperator = (state: IGameState) => Array<EntityCode>;
export type NewZoneOperator = () => IZone;

/**
 * TargetType is a valid TargetType to be used in Effects.
 */
export type TargetType = string;

/**
 * TargetTypes declares a mapping of TargetType this Zone can deal with.
 *
 * As this must be declared on each Zone as a literal, we can retain
 * type safety when referencing a specific TargetType.
 */
export type TargetTypes = {
    [TargetType: string]: string;
};

/**
 * IZoneDescription describes all necessary fields for a Zone
 * to function.
 */
export interface IZoneDescription {
    Self: ZoneCode;
    TargetTypes: TargetTypes;

    /**
     * Basic Add, Get, Remove, and Ordered operations
     * should be wrapped to enforce the validity of
     * data entering and exiting the Zone.
     */
    Add: AddEntityOperator;
    Get: GetEntityOperator;
    Remove: RemoveEntityOperator;
    Ordered: OrderedEntititiesOperator;

    /**
     * New provides the ability to create a new Zone satisfying
     * the constraints of the extensions of IZone.
     */
    New: NewZoneOperator;
}

/**
 * IZoneRegister allows Zones to register how they are handled
 * as well as assists in resolving TargetTypes to their zones.
 */
export interface IZoneRegister {
    Zones: Map<ZoneCode, IZoneDescription>;
    TargetTypes: Map<TargetType, Array<ZoneCode>>;
}

export class ZoneAssertError extends Error {
    constructor(desired: String, flag: String) {
        super(`cannot cast IZone to ${desired} with falsey ${flag}`);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, ZoneAssertError.prototype);
    }
}

export function ZoneAssertFail(desired: String,
    flag: String): ZoneAssertError {

    return new ZoneAssertError(desired, flag);
}
