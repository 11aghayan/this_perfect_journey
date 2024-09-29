import sharp from "sharp";

type Props = {
  photos: string[];
  is_profile: boolean;
}

export default async function optimize_photos({ photos, is_profile }: Props) {
  try {
    const photo_buffers = photos.map(photo => {
      const base_64_str = photo.split(',')[1];
      const buffer = Buffer.from(base_64_str, 'base64');
      return buffer;
    });
    
    const metadata_list = await Promise.all(photo_buffers.map(buffer => sharp(buffer).metadata()));
    
    const photo_promises = photo_buffers.map((photo, i) => {
      const metadata = metadata_list[i];
      const max_width = is_profile ? 300 : 1920;
      const max_height = is_profile ? 300 : 1080;
      const height = !metadata.height || metadata.height > max_height ? max_height : metadata.height;
      const width = !metadata.width || metadata.width > max_width ? max_width : metadata.width;
      
      return sharp(photo).resize(width, height).toFormat('webp').toBuffer();
    });
    const resolved_photos = (await Promise.all(photo_promises)).map(buffer => `data:image/webp;base64,${buffer.toString("base64")}`);
    return resolved_photos;
  } catch (error) {
    console.error('Error in optimize photos: ' + error);
    return { is_error: true }; 
  }
}