import { IEntity, EntityAssertFail } from '../Header';
import {
    IEffectPackFilter, IEffectPackMutator,
} from '../../Event/Header';

export interface IAsInterceptor extends IEntity {
    IsInterceptor: true;

    Filter: IEffectPackFilter;
    Mutator: IEffectPackMutator;
}
export function AsInterceptor(e: IEntity): IAsInterceptor {
    if (!e.IsInterceptor) throw EntityAssertFail('IAsInterceptor', 'IsInterceptor');
    return e as IAsInterceptor;
}
