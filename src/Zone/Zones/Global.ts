import { IZone, IZoneDescription } from '../Header';
import { IGameState } from '../../Game/Header';
import { IEntity, EntityCode } from '../../Entity/Header';

export function New(): IZone {
    throw Error('pseudo-Zone Global New accessed');
}

export function Add(entity: IEntity, state: IGameState) {
    throw Error('pseudo-Zone Global Add accessed');
}

export function Get(identity: EntityCode, state: IGameState): IEntity {
    throw Error('pseudo-Zone Global Get accessed');
}

export function Remove(identity: EntityCode, state: IGameState): IEntity {
    throw Error('pseudo-Zone Global Remove accessed');
}

/**
 * Global is a psudeo-Zone used to avoid needing to expose
 * a special case TargetType referencing global state.
 */
export const Self = 'global';
export const TargetTypes = {
    Global: 'global',
};
export const Desc = {
    Self,
    TargetTypes,

    Get, Add, Remove,
    New,
} as IZoneDescription;

export default Desc;
