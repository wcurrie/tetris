enum Color {
  LightBlue = 'cyan',
  DarkBlue = 'blue',
  Orange = 'orange',
  Yellow = 'yellow',
  LightGreen = 'green',
  Purple = 'purple',
  Red = 'red',
  Background = '#eee'
}

enum PieceOrientation {
  A, B, C, D
}

function rotateClockwise(current: PieceOrientation) {
  const {A, B, C, D} = PieceOrientation;
  switch (current) {
    case A:
      return B;
    case B:
      return C;
    case C:
      return D;
    case D:
      return A;
  }
}

function rotateAntitClockwise(current: PieceOrientation) {
  const {A, B, C, D} = PieceOrientation;
  switch (current) {
    case A:
      return D;
    case B:
      return A;
    case C:
      return B;
    case D:
      return C;
  }
}

class Tile {
  constructor(public column: number, public row: number) {
  }
}

type Tiler = (center: Tile, orientation: PieceOrientation) => Array<Tile>;

class Piece {

  constructor(
      public color: Color,
      public readonly orientation: PieceOrientation,
      public readonly tiler: Tiler
  ) {
  }

  toTiles(center: Tile): Array<Tile> {
    return this.tiler(center, this.orientation);
  }

  rotate(clockwise: boolean): Piece {
    if (clockwise) {
      return new Piece(this.color, rotateClockwise(this.orientation), this.tiler);
    } else {
      return new Piece(this.color, rotateAntitClockwise(this.orientation), this.tiler);
    }
  }
}

function newStick(): Piece {
  function stickTiler(center: Tile, orientation: PieceOrientation): Array<Tile> {
    const {column, row} = center;
    switch (orientation) {
      case PieceOrientation.A:
        return [
          new Tile(column - 1, row),
          new Tile(column, row),
          new Tile(column + 1, row),
          new Tile(column + 2, row)
        ];
      case PieceOrientation.B:
        return [
          new Tile(column, row - 1),
          new Tile(column, row),
          new Tile(column, row + 1),
          new Tile(column, row + 2)
        ];
      case PieceOrientation.C:
        return [
          new Tile(column - 1, row + 1),
          new Tile(column, row + 1),
          new Tile(column + 1, row + 1),
          new Tile(column + 2, row + 1)
        ];
      case PieceOrientation.D:
        return [
          new Tile(column - 1, row - 1),
          new Tile(column - 1, row),
          new Tile(column - 1, row + 1),
          new Tile(column - 1, row + 2)
        ];

    }
  }
  return new Piece(Color.LightBlue, PieceOrientation.A, stickTiler);
}


type Cell = Piece | null

class Board {

  private readonly cells: Cell[][];
  private readonly cellsByPiece = new Map<Piece, Array<Tile>>();

  constructor(public columns: number = 10, public rows: number = 20) {
    this.cells = new Array<Cell[]>(rows);
    for (let row = 0; row < rows; row++) {
      this.cells[row] = new Array(columns);
    }
  }

  public addPiece(piece: Piece, center: Tile): boolean {
    const tiles = piece.toTiles(center);
    if (!this.canAdd(tiles)) {
      return false;
    }
    this.update(tiles, piece);
    this.cellsByPiece.set(piece, tiles);
    return true;
  }

  public remove(piece: Piece) {
    const tiles = this.cellsByPiece.get(piece);
    this.update(tiles, null);
    this.cellsByPiece.delete(piece);
  }

  public colorOf(column: number, row: number): Color {
    const cell = this.cells[row][column];
    return cell && cell.color;
  }

  private canAdd(tiles: Array<Tile>): boolean {
    return tiles.every(({column, row}) => {
      return column >= 0 && column < this.columns
          && row >= 0 && row < this.rows
          && (this.cells[row][column] == null);
    });
  }

  private update(tiles: Array<Tile>, piece: Piece) {
    tiles.forEach(({column, row}) => {
      this.cells[row][column] = piece;
    });
  }
}

class BoardRenderer {

  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;

  constructor(public tilePx: number = 30, public board: Board) {
    const {columns, rows} = board;
    this.canvas = document.createElement('canvas') as HTMLCanvasElement;
    this.canvas.setAttribute('width', (tilePx * columns).toString());
    this.canvas.setAttribute('height', (tilePx * rows).toString());
    this.ctx = this.canvas.getContext('2d');
  }

  public render() {
    const {columns, rows} = this.board;
    const {tilePx, ctx} = this;
    for (let column = 0; column < columns; column++) {
      for (let row = 0; row < rows; row++) {
        let color = this.board.colorOf(column, row);
        ctx.beginPath();
        ctx.rect(column * tilePx, row * tilePx, tilePx, tilePx);
        if (color) {
          ctx.fillStyle = color;
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        } else {
          ctx.fillStyle = Color.Background;
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        }
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
      }
    }
  }

}

class Game {

  private currentPiece: Piece;
  private currentCenter: Tile;

  constructor(private readonly board: Board, private readonly renderer: BoardRenderer) {
  }

  public addPiece(piece: Piece, center: Tile) {
    if (this.board.addPiece(piece, center)) {
      this.currentPiece = piece;
      this.currentCenter = center;
    }
  }

  public rotate(clockwise: boolean) {
    if (this.currentPiece) {
      const shifted = this.currentPiece.rotate(clockwise);
      this.updateCurrent(shifted, this.currentCenter)
    }
  }
  public shift(right: boolean) {
    if (this.currentPiece) {
      const {column, row} = this.currentCenter;
      const columnDelta = right ? 1 : -1;
      const newCenter = new Tile(column + columnDelta, row);
      this.updateCurrent(this.currentPiece, newCenter);
    }
  }

  private updateCurrent(newCurrent: Piece, newCenter: Tile) {
    this.board.remove(this.currentPiece);
    if (!this.board.addPiece(newCurrent, newCenter)) {
      this.board.addPiece(this.currentPiece, this.currentCenter);
    } else {
      this.currentPiece = newCurrent;
      this.currentCenter = newCenter;
      this.renderer.render();
    }
  }
}

const board = new Board();
const renderer = new BoardRenderer(30, board);
const game = new Game(board, renderer);
game.addPiece(newStick(), new Tile(2, 2));
document.body.appendChild(renderer.canvas);
renderer.render();

document.addEventListener('keydown', (e: KeyboardEvent) => {
  switch (e.key) {
    case 'ArrowUp':
      game.rotate(false);
      break;
    case 'ArrowDown':
      game.rotate(true);
      break;
    case 'ArrowLeft':
      game.shift(false);
      break;
    case 'ArrowRight':
      game.shift(true);
      break;
  }
});
