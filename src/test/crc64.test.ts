import { assertEquals } from '@std/assert';

Deno.test('jsr:@zsqk/crc64', async () => {
  const { crc64 } = await import('@zsqk/crc64');
  const data = new TextEncoder().encode('Hello, world!\n');
  const hash = crc64(data);
  assertEquals(hash, '14559282277039517123');
});
