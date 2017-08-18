import { IEntity } from '../Entity/Header';
// import {  } from '../Entity/Entities';

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