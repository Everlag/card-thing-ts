export enum Effect {
    // EndTurn pushes a StartTurn.
    //
    // Target of EndTurn is the player whose turn is currently
    // completing.
    EndTurn = 'end-turn',
}