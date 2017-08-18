import {
    PlayerBehavior,
} from '../../Player/Header';
import {
    IEntity, EntityAssertFail,
} from '../Header';

export interface IAsPlayer extends IEntity {
    IsPlayer: true;

    Behavior: PlayerBehavior;
}
export function AsPlayer(e: IEntity): IAsPlayer {
    if (!e.IsPlayer) throw EntityAssertFail('IAsPlayer', 'IsPlayer');
    return e as IAsPlayer;
}
