import { TestCase } from '../Zone_test';
import * as T from '../../test';
import { IPlayerInitToPlayer } from '../../Game/Game';
import Players from './Players';

let cases: Array<TestCase> = [];

(() => {
    cases.push([
        {
            Identity: T.PlayerOneEntityCode,
        },
        Players.Self,
        Players.TargetTypes.Player,
        'Players add throws when given bare IEntity',
        'add',
        true,
    ]);

    cases.push([
        {
            Identity: T.PlayerOneEntityCode,
        },
        Players.Self,
        Players.TargetTypes.Player,
        'Players find throws when given bare IEntity',
        'find',
        true,
    ]);

    cases.push([
        IPlayerInitToPlayer(T.PlayerOneInit),
        Players.Self,
        Players.TargetTypes.Player,
        'Players find succeeds when given valid Player',
        'find',
        false,
    ]);

    cases.push([
        IPlayerInitToPlayer(T.PlayerOneInit),
        Players.Self,
        Players.TargetTypes.Player,
        'Players add succeeds when given valid Player',
        'add',
        false,
    ]);
})();

export default cases;
