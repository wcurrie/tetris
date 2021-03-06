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

function rotateAntiClockwise(current: PieceOrientation) {
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
      return new Piece(this.color, rotateAntiClockwise(this.orientation), this.tiler);
    }
  }
}

function newStick(): Piece {
  function stickTiler(center: Tile, orientation: PieceOrientation): Array<Tile> {
    switch (orientation) {
      case PieceOrientation.A:
        return toTiles(center, [
          [0, 0, 0, 0],
          [1, 1, 1, 1],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ]);
      case PieceOrientation.B:
        return toTiles(center, [
          [0, 1, 0, 0],
          [0, 1, 0, 0],
          [0, 1, 0, 0],
          [0, 1, 0, 0],
        ]);
      case PieceOrientation.C:
        return toTiles(center, [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [1, 1, 1, 1],
          [0, 0, 0, 0],
        ]);
      case PieceOrientation.D:
        return toTiles(center, [
          [0, 0, 1, 0],
          [0, 0, 1, 0],
          [0, 0, 1, 0],
          [0, 0, 1, 0],
        ]);
    }
  }

  return new Piece(Color.LightBlue, PieceOrientation.A, stickTiler);
}

function toTiles(center: Tile, positions: Array<Array<number>>): Array<Tile> {
  const tiles = Array<Tile>();
  positions.forEach((columns, row) => {
    columns.forEach((v, column) => {
      if (v) {
        tiles.push(new Tile(center.column + column, center.row + row));
      }
    })
  });
  return tiles;
}

function newJ(): Piece {
  function jTiler(center: Tile, orientation: PieceOrientation): Array<Tile> {
    switch (orientation) {
      case PieceOrientation.A:
        return toTiles(center, [
          [1, 0, 0],
          [1, 1, 1],
          [0, 0, 0],
        ]);
      case PieceOrientation.B:
        return toTiles(center, [
          [0, 1, 1],
          [0, 1, 0],
          [0, 1, 0],
        ]);
      case PieceOrientation.C:
        return toTiles(center, [
          [0, 0, 0],
          [1, 1, 1],
          [0, 0, 1],
        ]);
      case PieceOrientation.D:
        return toTiles(center, [
          [0, 1, 0],
          [0, 1, 0],
          [1, 1, 0],
        ]);
    }
  }
  return new Piece(Color.DarkBlue, PieceOrientation.A, jTiler);
}

function newL(): Piece {
  function lTiler(center: Tile, orientation: PieceOrientation): Array<Tile> {
    switch (orientation) {
      case PieceOrientation.A:
        return toTiles(center, [
          [0, 0, 1],
          [1, 1, 1],
          [0, 0, 0],
        ]);
      case PieceOrientation.B:
        return toTiles(center, [
          [0, 1, 0],
          [0, 1, 0],
          [0, 1, 1],
        ]);
      case PieceOrientation.C:
        return toTiles(center, [
          [0, 0, 0],
          [1, 1, 1],
          [1, 0, 0],
        ]);
      case PieceOrientation.D:
        return toTiles(center, [
          [1, 1, 0],
          [0, 1, 0],
          [0, 1, 0],
        ]);
    }
  }
  return new Piece(Color.Orange, PieceOrientation.A, lTiler);
}

function newSquare(): Piece {
  function squareTiler(center: Tile, orientation: PieceOrientation): Array<Tile> {
    return toTiles(center, [
      [1, 1],
      [1, 1],
    ]);
  }
  return new Piece(Color.Yellow, PieceOrientation.A, squareTiler);
}

function newS(): Piece {
  function sTiler(center: Tile, orientation: PieceOrientation): Array<Tile> {
    switch (orientation) {
      case PieceOrientation.A:
        return toTiles(center, [
          [0, 1, 1],
          [1, 1, 0],
          [0, 0, 0],
        ]);
      case PieceOrientation.B:
        return toTiles(center, [
          [0, 1, 0],
          [0, 1, 1],
          [0, 0, 1],
        ]);
      case PieceOrientation.C:
        return toTiles(center, [
          [0, 0, 0],
          [0, 1, 1],
          [1, 1, 0],
        ]);
      case PieceOrientation.D:
        return toTiles(center, [
          [1, 0, 0],
          [1, 1, 0],
          [0, 1, 0],
        ]);
    }
  }
  return new Piece(Color.LightGreen, PieceOrientation.A, sTiler);
}

function newT(): Piece {
  function tTiler(center: Tile, orientation: PieceOrientation): Array<Tile> {
    switch (orientation) {
      case PieceOrientation.A:
        return toTiles(center, [
          [0, 1, 0],
          [1, 1, 1],
          [0, 0, 0],
        ]);
      case PieceOrientation.B:
        return toTiles(center, [
          [0, 1, 0],
          [0, 1, 1],
          [0, 1, 0],
        ]);
      case PieceOrientation.C:
        return toTiles(center, [
          [0, 0, 0],
          [1, 1, 1],
          [0, 1, 0],
        ]);
      case PieceOrientation.D:
        return toTiles(center, [
          [0, 1, 0],
          [1, 1, 0],
          [0, 1, 0],
        ]);
    }
  }
  return new Piece(Color.Purple, PieceOrientation.A, tTiler);
}

function newZ(): Piece {
  function zTiler(center: Tile, orientation: PieceOrientation): Array<Tile> {
    switch (orientation) {
      case PieceOrientation.A:
        return toTiles(center, [
          [1, 1, 0],
          [0, 1, 1],
          [0, 0, 0],
        ]);
      case PieceOrientation.B:
        return toTiles(center, [
          [0, 0, 1],
          [0, 1, 1],
          [0, 1, 0],
        ]);
      case PieceOrientation.C:
        return toTiles(center, [
          [0, 0, 0],
          [1, 1, 0],
          [0, 1, 1],
        ]);
      case PieceOrientation.D:
        return toTiles(center, [
          [0, 1, 0],
          [1, 1, 0],
          [1, 0, 0],
        ]);
    }
  }
  return new Piece(Color.Red, PieceOrientation.A, zTiler);
}

type Cell = Piece | null

class Board {

  private readonly cells: Cell[][];

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
    return true;
  }

  public remove(piece: Piece, center: Tile) {
    const tiles = piece.toTiles(center);
    this.update(tiles, null);
  }

  public deleteRow(row: number) {
    // empty the row
    this.cells[row].forEach((_, cell, theRow) => {
      theRow[cell] = null;
    });
    // move everything above down by 1 row
    for (let r = row - 1; r >=0 ; r--) {
      this.cells[r].forEach((tile, cell) => {
        this.cells[r + 1][cell] = tile;
      });
    }
  }

  public colorOf(column: number, row: number): Color {
    const cell = this.cells[row][column];
    return cell && cell.color;
  }

  public findFullRows(): Array<number> {
    const rowIsFull = (row: Array<Cell>) => {
      let fullCells = 0;
      for (let r = 0; r < row.length; r++) {
        const cell = row[r];
        if (cell !== null && cell !== undefined) {
          fullCells++;
        }
      }
      return fullCells === row.length;
    };
    const fullRows = [];
    for (let r = 0; r < this.cells.length; r++) {
      if (rowIsFull(this.cells[r])) {
        fullRows.push(r);
      }
    }
    return fullRows;
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

  public render(fullRows: Array<number> = [], fullAlpha: number = 1.0) {
    const {columns, rows} = this.board;
    const {tilePx, ctx} = this;
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        let color = this.board.colorOf(column, row);
        ctx.beginPath();
        ctx.clearRect(column * tilePx, row * tilePx, tilePx, tilePx);
        ctx.rect(column * tilePx, row * tilePx, tilePx, tilePx);
        if (color) {
          if (fullRows.indexOf(row) !== -1) {
            ctx.globalAlpha = fullAlpha;
          } else {
            ctx.globalAlpha = 1.0;
          }
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
  private currentPeriodMillis: number;
  private lastTickTime: number;
  private dropping: boolean;
  public fullRows: Array<number>;
  private fullRowAlpha: number;

  constructor(
      private readonly board: Board,
      private readonly renderer: BoardRenderer,
      private readonly pieces: Array<(() => Piece)>
  ) {
    this.lastTickTime = 0;
    this.currentPeriodMillis = 800;
    this.dropping = false;
    this.fullRows = [];
  }

  public start() {
    const self = this;
    function step() {
      self.tick();
      window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }

  public tick() {
    if (this.fullRows.length > 0) {
      // assert: !dropping && this.currentPiece == null
      this.fullRowAlpha -= 0.04;
      if (this.fullRowAlpha > 0) {
        this.renderer.render(this.fullRows, this.fullRowAlpha);
      } else {
        for (let row of this.fullRows) {
          this.board.deleteRow(row);
        }
        this.fullRows = [];
        this.renderer.render();
      }
    } else {
      const now = Date.now();
      const period = this.dropping ? 20 : this.currentPeriodMillis;
      if ((now - this.lastTickTime) >= period) {
        if (this.currentPiece) {
          this.advance();
        } else {
          this.newPiece();
        }
        this.renderer.render();
        this.lastTickTime = now;
      }
    }
  }

  private advance() {
    const {column, row} = this.currentCenter;
    const newCenter = new Tile(column, row + 1);
    if (!this.updateCurrent(this.currentPiece, newCenter)) {
      this.fullRows = this.board.findFullRows();
      if (this.fullRows.length == 0) {
        this.newPiece();
      } else {
        this.fullRowAlpha = 1.0;
      }
    }
  }

  private newPiece() {
    this.dropping = false;
    const piece = this.randomPiece();
    this.addPiece(piece, new Tile(4, 0));
  }

  public addPiece(piece: Piece, center: Tile) {
    if (this.board.addPiece(piece, center)) {
      this.currentPiece = piece;
      this.currentCenter = center;
    }
  }

  public rotate(clockwise: boolean) {
    if (this.currentPiece && !this.dropping) {
      const shifted = this.currentPiece.rotate(clockwise);
      this.updateCurrent(shifted, this.currentCenter)
    }
  }

  public shift(right: boolean) {
    if (this.currentPiece && !this.dropping) {
      const {column, row} = this.currentCenter;
      const columnDelta = right ? 1 : -1;
      const newCenter = new Tile(column + columnDelta, row);
      this.updateCurrent(this.currentPiece, newCenter);
    }
  }

  public drop() {
    this.dropping = true;
  }

  private updateCurrent(newCurrent: Piece, newCenter: Tile): boolean {
    this.board.remove(this.currentPiece, this.currentCenter);
    if (!this.board.addPiece(newCurrent, newCenter)) {
      this.board.addPiece(this.currentPiece, this.currentCenter);
      return false;
    } else {
      this.currentPiece = newCurrent;
      this.currentCenter = newCenter;
      this.renderer.render();
      return true;
    }
  }

  private randomPiece() {
    return this.pieces[Math.floor(Math.random() * this.pieces.length)]();
  }
}

const pieces = [
    newStick,
    newJ,
    newL,
    newSquare,
    newS,
    newT,
    newZ,
];
const board = new Board();
const renderer = new BoardRenderer(30, board);
const game = new Game(board, renderer, pieces);
document.body.appendChild(renderer.canvas);
renderer.render();

// debug
(<any>window).game = game;

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
    case ' ':
      game.drop();
      break;
  }
});

game.start();
