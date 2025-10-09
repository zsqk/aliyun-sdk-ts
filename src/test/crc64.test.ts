Deno.test('npm:crc64-ecma182.js', async () => {
  const { crc64 } = await import('@zsqk/crc64');
  const data = new TextEncoder().encode('Hello, world!\n');
  const hash = crc64(data);
  console.log(hash);
});
