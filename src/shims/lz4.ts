// Minimal shim for lz4 to avoid native module loading under Deno during tests.
// This provides the API surface expected by packages that import `lz4` but
// do not actually need compression in our test scenarios.

// Export common functions as no-op or lightweight JS implementations.

export function encode(input: Uint8Array | string): Uint8Array {
  if (typeof input === 'string') {
    return new TextEncoder().encode(input);
  }
  return input;
}

export function decode(input: Uint8Array | string): Uint8Array {
  if (typeof input === 'string') {
    return new TextEncoder().encode(input);
  }
  return input;
}

export const createEncoder = () => {
  return {
    push(chunk: Uint8Array) {
      // simply return the chunk
      return chunk;
    },
    end() {
      return new Uint8Array();
    },
  };
};

export const createDecoder = () => {
  return {
    push(chunk: Uint8Array) {
      return chunk;
    },
    end() {
      return new Uint8Array();
    },
  };
};

export default {
  encode,
  decode,
  createEncoder,
  createDecoder,
};
