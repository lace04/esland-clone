import { Glob } from 'bun';
import sharp from 'sharp';
import { join, dirname, extname, basename } from 'node:path';
import { rm } from 'node:fs/promises';

const glob = new Glob('public/**/*.{jpg,jpeg,png}');

const shouldRemove = (str: string = '') => str.toLowerCase().startsWith('rm');
const remove = shouldRemove(process.argv[2]?.toLowerCase());

for await (const file of glob.scan('.')) {
  console.info(`Converting ${file}`);
  const ext = extname(file);
  const newFileName = basename(file, ext);
  const dir = dirname(file);
  const newFilePath = join(dir, newFileName) + '.webp';
  const convert = sharp(file)
    // .trim({ threshold: 0 }) // This removes transparent pixels
    .webp({
      lossless: true,
      quality: 100
    });

  await convert.toFile(newFilePath);
  console.info(`Converted to ${newFilePath}`);

  if (remove) {
    console.log(`Removing old file ${file}`)
    await rm(file, { force: true })
  }
}