import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
export const alt = 'Sisi Care — compassionate in-home care in Bellevue and the Eastside';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default async function Image() {
  const [logo, photo] = await Promise.all([
    readFile(join(process.cwd(), 'public/images/sisi-care-logo-hd.png')),
    readFile(join(process.cwd(), 'public/images/enhenced-new/hero.jpg')),
  ]);
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        background: '#fff9f6',
        color: '#153c53',
      }}
    >
      <div
        style={{
          width: '60%',
          padding: '58px 50px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Native images are required inside ImageResponse. */}
        <img
          src={`data:image/png;base64,${logo.toString('base64')}`}
          width={340}
          height={87}
          alt="Sisi Care"
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ fontSize: 58, fontWeight: 700, lineHeight: 1.1 }}>
            Compassionate care. Right at home.
          </div>
          <div style={{ fontSize: 28 }}>Bellevue &amp; the Eastside</div>
        </div>
        <div style={{ fontSize: 23, color: '#d20a61' }}>sisicarewa.com · (206) 334-3505</div>
      </div>
      <img
        src={`data:image/jpeg;base64,${photo.toString('base64')}`}
        width={480}
        height={630}
        alt="Caregiver with an older woman"
        style={{ objectFit: 'cover', objectPosition: 'center' }}
      />
    </div>,
    size,
  );
}
