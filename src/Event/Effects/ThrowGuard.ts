import {
    IEffectDescription,
} from '../Header';
import {
    IGameState,
} from '../../Game/Header';

/**
 * ThrowGuard throws an exception.
 *
 * This Effect is used for testing.
 * Typical usage is to include this in the stack to either be cancelled
 * or to ensure it never gets executed. Consider this our
 * flavor of a stack canary.
 */
export function Op(): IGameState {
    throw Error(`${Self} Effect executed - guard violated`);
}

export const Self = 'throw-guard';

export const Desc = {
    Op, Self,
} as IEffectDescription;

export default Desc;
