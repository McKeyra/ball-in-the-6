import { ImageResponse } from 'next/og';

export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

export default function AppleIcon(): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#C8FF00',
          borderRadius: '36px',
        }}
      >
        <div
          style={{
            fontSize: 88,
            fontWeight: 900,
            color: '#000000',
            letterSpacing: '-4px',
            display: 'flex',
          }}
        >
          B6
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
