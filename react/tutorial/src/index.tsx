import * as React from 'react';
import * as ReactDOM from 'react-dom';

function calculateWinner(squares: Array<string>) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];

      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }

    return null;
  }

class Game extends React.Component {
    render() {
      return (
        <div className="game">
          <div className="game-board">
            <Board />
          </div>
          <div className="game-info">
            <div>{/* status */}</div>
            <ol>{/* TODO */}</ol>
          </div>
        </div>
      );
    }
  }

interface BoardProps {
    squares: Array<string>,
    xIsNext: boolean,
}

class Board extends React.Component {
    public state: BoardProps = {
        squares: Array(9).fill(null),
        xIsNext: true,
    }

    constructor(props: any) {
        super(props);
    }

    handleClick = (i: number) => {
        const squares = [...this.state.squares];

        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';

        this.setState({ squares, xIsNext: !this.state.xIsNext, });
    };

    renderSquare(i: number) {
        return <Square value={this.state.squares[i]} onClick={() => this.handleClick(i)} />;
    }

    render() {
        const winner = calculateWinner(this.state.squares);
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

interface SquareBoard {
    value: string,
    onClick: () => void
}

class Square extends React.Component {
    constructor(public props: SquareBoard) {
        super(props);
    }

    render() {
        return (
            <button className='square' onClick={() => this.props.onClick()}>
                {this.props.value}
            </button>
        );
    }
}

ReactDOM.render(
    <Game />,
    document.getElementById('app')
);