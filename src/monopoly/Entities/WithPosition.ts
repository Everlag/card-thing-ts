import {
    IEntity, EntityAssertFail,
} from '../../core/Entity/Header';

export interface IWithPosition extends IEntity {
    HasPosition: true;

    Position: number;
}
export function WithPosition(e: IEntity): IWithPosition {
    if (!e.HasPosition) throw EntityAssertFail('IWithPosition', 'HasPosition');

    // Ensure money is valid.
    let withPosition = e as IWithPosition;
    if (isNaN(withPosition.Position) ||
        withPosition.Position < 0) {
        throw EntityAssertFail('IWithPosition', 'Position');
    }
    return withPosition;
}
