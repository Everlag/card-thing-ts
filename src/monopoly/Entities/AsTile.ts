import {
    IEntity, EntityAssertFail,
} from '../../core/Entity/Header';

// TODO: factor out data to entity translation
import {
    IGameState,
} from '../../core/Game/Header';
import {
    getRNGContext,
} from '../../core/Game/Game';
import {
    NewEntityCode,
} from '../../core/Entity/EntityCode';

// IAsTile must be a valid Position
import { WithPosition } from './WithPosition';

export enum PropertyGroup {
    Special = 'Special',
    Utilities = 'Utilities',
    Railroad = 'Railroad',

    Purple = 'Purple',
    Lightgreen = 'Lightgreen',
    Violet = 'Violet',
    Orange = 'Orange',
    Red = 'Red',
    Yellow = 'Yellow',
    Darkgreen = 'Darkgreen',
    Darkblue = 'Darkblue',
}

export interface IAsTile extends IEntity {
    IsTile: true;

    Name: string;

    /**
     * The property group the property belongs to for the purpose
     * of rent multiplication.
     */
    Group: PropertyGroup;
}
export function AsTile(e: IEntity): IAsTile {
    if (!e.IsTile) throw EntityAssertFail('IAsTile', 'AsTile');

    // Ensure position is valid.
    let asTile = e as IAsTile;
    WithPosition(asTile);
    return asTile;
}
