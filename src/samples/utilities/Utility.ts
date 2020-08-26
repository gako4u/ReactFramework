namespace Utility {
  export function generateUuid(): number {
    let uuid = 0;

    for (let i = 0; i < 32; i++) {
      const random = Math.random() * 16 | 0;
      const val = i === 12 ? 4 : (i === 16 ? ((random & 3) | 8) : random);
      uuid += val * (16 ** i);
    }

    return uuid;
  }

  export function sleep(milliseconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(() => resolve(), milliseconds));
  }
}

export default Utility;
