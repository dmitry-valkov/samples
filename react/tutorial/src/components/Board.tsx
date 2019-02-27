import * as React from 'react';
import { Square } from './Square';
import { Winner, SquareValue } from '../classes/Winner';

export interface BoardState {
    squares: Array<SquareValue>,
    xIsNext: boolean,
}

export class Board extends React.Component {
    public state: BoardState = {
        squares: Array(9).fill(null),
        xIsNext: true,
    }

    constructor(props: any) {
        super(props);
    }

    handleClick = (i: number) => {
        const squares = [...this.state.squares];

        if (Winner.calculate(squares) || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';

        this.setState({ squares, xIsNext: !this.state.xIsNext, });
    };

    renderSquare(i: number) {
        return <Square value={this.state.squares[i]} onClick={() => this.handleClick(i)} />;
    }

    render() {
        const winner = Winner.calculate(this.state.squares);
        let status;

        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
    
        return (
          <div>
            <div className="status">{status}</div>
            <div className="board-row">
              {this.renderSquare(0)}
              {this.renderSquare(1)}
              {this.renderSquare(2)}
            </div>
            <div className="board-row">
              {this.renderSquare(3)}
              {this.renderSquare(4)}
              {this.renderSquare(5)}
            </div>
            <div className="board-row">
              {this.renderSquare(6)}
              {this.renderSquare(7)}
              {this.renderSquare(8)}
            </div>
          </div>
        );
    }
}