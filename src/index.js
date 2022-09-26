import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import StraightIcon from "@mui/icons-material/Straight";

const sz = 10; //Size of board: sz * sz

function Square(props) {
  return (
    <button className={`square ${props.className}`} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        className={
          this.props.winner && this.props.winner.includes(i) ? "win" : ""
        }
      />
    );
  }

  render() {
    return (
      <div className="game-matrix">
        {Array(sz * sz)
          .fill(null)
          .map((item, index) => (
            <div className="game-square" key={index}>
              {this.renderSquare(index)}
            </div>
          ))}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(sz * sz).fill(null),
          currentLocation: null,
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      ascending: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || calculateDraw(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          currentLocation: i,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      ascending: this.state.ascending,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  handleToggleClick(ascending) {
    this.setState({
      ascending: !ascending,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const draw = calculateDraw(current.squares);

    const moves = history.map((step, move) => {
      const col = (step.currentLocation % sz) + 1;
      const row = Math.floor(step.currentLocation / sz) + 1;
      const desc = move
        ? "Go to move #" + move + ": (" + col + "," + row + ")"
        : "Go to game start";
      return (
        <li key={move}>
          <button
            className={`history-button ${
              move === this.state.stepNumber ? "selected" : ""
            }`}
            onClick={() => this.jumpTo(move)}
          >
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + current.squares[winner[0]];
      console.log(winner);
    } else if (draw) {
      status = "Draw";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }
    return (
      <div>
        <div className="game-title">Gomoku</div>
        <div className="game">
          <div className="game-board">
            <Board
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
              winner={winner}
            />
          </div>
          <div className="game-info">
            <div className="game-status">
              {status}
              <div
                className="toggle-button-hislist"
                onClick={() => this.handleToggleClick(this.state.ascending)}
              >
                <StraightIcon
                  className={`arrow ${this.state.ascending ? "" : "down"}`}
                ></StraightIcon>
              </div>
            </div>
            <ol className="history-list">
              {this.state.ascending ? moves : moves.slice(0).reverse()}
            </ol>
          </div>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
  for (let i = 0; i < sz; i++) {
    for (let j = 0; j < sz; j++) {
      if (
        j < sz - 4 &&
        squares[i * sz + j] &&
        squares[i * sz + j] === squares[i * sz + j + 1] &&
        squares[i * sz + j] === squares[i * sz + j + 2] &&
        squares[i * sz + j] === squares[i * sz + j + 3] &&
        squares[i * sz + j] === squares[i * sz + j + 4]
      ) {
        return [
          i * sz + j,
          i * sz + j + 1,
          i * sz + j + 2,
          i * sz + j + 3,
          i * sz + j + 4,
        ];
      }
      if (
        i < sz - 4 &&
        squares[i * sz + j] &&
        squares[i * sz + j] === squares[(i + 1) * sz + j] &&
        squares[i * sz + j] === squares[(i + 2) * sz + j] &&
        squares[i * sz + j] === squares[(i + 3) * sz + j] &&
        squares[i * sz + j] === squares[(i + 4) * sz + j]
      ) {
        return [
          i * sz + j,
          (i + 1) * sz + j,
          (i + 2) * sz + j,
          (i + 3) * sz + j,
          (i + 4) * sz + j,
        ];
      }
      if (
        i < sz - 4 &&
        j < sz - 4 &&
        squares[i * sz + j] &&
        squares[i * sz + j] === squares[(i + 1) * sz + j + 1] &&
        squares[i * sz + j] === squares[(i + 2) * sz + j + 2] &&
        squares[i * sz + j] === squares[(i + 3) * sz + j + 3] &&
        squares[i * sz + j] === squares[(i + 4) * sz + j + 4]
      ) {
        return [
          i * sz + j,
          (i + 1) * sz + j + 1,
          (i + 2) * sz + j + 2,
          (i + 3) * sz + j + 3,
          (i + 4) * sz + j + 4,
        ];
      }
      if (
        i < sz - 4 &&
        j > 3 &&
        squares[i * sz + j] &&
        squares[i * sz + j] === squares[(i + 1) * sz + j - 1] &&
        squares[i * sz + j] === squares[(i + 2) * sz + j - 2] &&
        squares[i * sz + j] === squares[(i + 3) * sz + j - 3] &&
        squares[i * sz + j] === squares[(i + 4) * sz + j - 4]
      ) {
        return [
          i * sz + j,
          (i + 1) * sz + j - 1,
          (i + 2) * sz + j - 2,
          (i + 3) * sz + j - 3,
          (i + 4) * sz + j - 4,
        ];
      }
    }
  }
  return null;
}

function calculateDraw(squares) {
  for (let i = 0; i < sz * sz; i++) {
    if (!squares[i]) {
      return;
    }
  }
  return true;
}
