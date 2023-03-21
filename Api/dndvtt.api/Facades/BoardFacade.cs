﻿using dndvtt.api.Facades.Interfaces;
using dndvtt.api.Models.Board;
using dndvtt.api.Models.Board.Interfaces;

namespace dndvtt.api.Facades
{
    public class BoardFacade : IBoardFacade
    {
        private List<BoardModel> _boardHistory;

        public BoardFacade()
        {
            _boardHistory = new List<BoardModel>
            {
                new BoardModel(200, 200)
            };
        }

        public BoardModel AddToken(IBoardEntity token, Position position)
        {
            BoardModel newState = new BoardModel(_boardHistory.Last());
            newState._cells[position.X][position.Y].Occupant = token;
            _boardHistory.Add(newState);
            return newState;
        }

        public BoardModel Refresh()
        {
            return _boardHistory.Last();
        }
    }
}
