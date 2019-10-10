export interface Factor<T> {
  readonly level: ReadonlyArray<T>; // The distinct values
  readonly size: number;
  elements(): IterableIterator<T>; // contained items
}

export function newFactor(elements: string[]): Factor<string> {
  const level: string[] = [];
  const indexByLevel: { [key: string]: number } = {};

  function intern(v: string) {
    const i = level.length;
    level.push(v);
    indexByLevel[v] = i;
    return i;
  }

  function index(v: string) {
    const i = indexByLevel[v];
    return i !== undefined ? i : intern(v);
  }

  return stringFactor(
    varintEncode(elements.map(index)),
    level,
    elements.length
  );
}

function varintEncode(indices: number[]): ArrayBuffer {
  const size = (n: number) =>
    n < 0x4000 ? (n < 0x80 ? 1 : 2) : n < 0x200000 ? 3 : n < 0x10000000 ? 4 : 5;

  const buffer = new ArrayBuffer(indices.reduce((s, n) => s + size(n), 0));
  const view = new DataView(buffer);
  let i = 0;
  function encode(n: number, size: number) {
    if (size === 1) {
      view.setUint8(i++, n & 0x7f);
    } else {
      view.setUint8(i++, (n >>> (--size * 7)) | 0x80);
      encode(n, size);
    }
  }

  for (const n of indices) {
    encode(n, size(n));
  }
  return buffer;
}

function stringFactor(
  buffer: ArrayBuffer,
  level: string[],
  size: number
): Factor<string> {
  function* elements() {
    for (const i of varintDecode(buffer)) {
      yield level[i];
    }
  }
  return { level, size, elements };
}

function* varintDecode(buffer: ArrayBuffer) {
  const view = new DataView(buffer);
  let next = 0;
  for (let i = 0; i < buffer.byteLength; ) {
    let byte = view.getUint8(i++);
    while (byte & 0x80) {
      next = (next << 7) + (byte & 0x7f);
      byte = view.getUint8(i++);
    }
    yield (next << 7) + byte;
    next = 0;
  }
}
