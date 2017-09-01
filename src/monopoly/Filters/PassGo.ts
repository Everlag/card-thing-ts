import {
    IGameState,
} from '../../core/Game/Header';
import {
    IEffectPack, IEffectPackFilter,
} from '../../core/Event/Header';

import Players from '../../core/Zone/Zones/Players';

import { WithPosition } from '../Entities/WithPosition';

import {
    AsMove, IsMove, WrapPlayerPostion,
} from '../Effects/Move';

export interface IPassesGo extends IEffectPackFilter {
    PassesGo?: boolean;
}
export function PassesGo(
    pack: IEffectPack, filter: IEffectPackFilter,
    state: IGameState,
): boolean {
    if (!IsMove(pack)) {
        throw Error(`${Self} filter applied to non-Move effect`);
    }

    if (pack.Targets.length !== 1) {
        throw Error(`${Self} filter applied to effect with ${pack.Targets.length} targets instead of 1`);
    }

    let asMove = AsMove(pack);
    let delta = asMove.Rolls.reduce((a, b) => a + b);

    let player = Players.Get(pack.Targets[0], state);
    let withPos = WithPosition(player);

    let startingPos = withPos.Position;
    let newPos = WrapPlayerPostion(player.Identity, delta, state);

    // If the new position is lower than the old position,
    // we can be considered to have wrapped.
    return startingPos > newPos;
}

export const Self = 'PassesGo';

export default PassesGo;
