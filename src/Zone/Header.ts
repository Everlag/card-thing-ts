import { IEntity, EntityCode } from '../Entity/Header';
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
    [Entity: string]: IEntity;
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
    Contents: IEntityCollection;
}

export type AddEntityOperator = (entity: IEntity, state: IGameState) => void;
export type GetEntityOperator = (identity: EntityCode, state: IGameState) => IEntity;

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
     * Basic Add and Get operations should be wrapped
     * to enforce the validity of data entering and
     * exiting the Zone.
     */
    Add: AddEntityOperator;
    Get: GetEntityOperator;
}
