import { IEntity, EntityAssertFail } from '../Header';

export interface IWithHealth extends IEntity {
    Health: number;

    HasHealth: true;
}
export function AsWithHealth(e: IEntity): IWithHealth {
    if (!e.HasHealth) throw EntityAssertFail('IWithHealth', 'HasHealth');
    return e as IWithHealth;
}
