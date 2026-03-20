import { ImageResponse } from 'next/og';

export const alt = 'Ball in the 6 — Toronto Sports';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function OGImage(): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
          position: 'relative',
        }}
      >
        {/* Lime accent gradient overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(ellipse at 70% 20%, rgba(200, 255, 0, 0.15) 0%, transparent 60%)',
            display: 'flex',
          }}
        />

        {/* Top border accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: '#C8FF00',
            display: 'flex',
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '-2px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <span>BALL IN THE</span>
            <span style={{ color: '#C8FF00' }}>6</span>
          </div>

          <div
            style={{
              fontSize: 28,
              color: '#a3a3a3',
              fontWeight: 400,
              letterSpacing: '4px',
              textTransform: 'uppercase',
              display: 'flex',
            }}
          >
            Toronto&apos;s Operating System for Sports
          </div>
        </div>

        {/* Bottom branding */}
        <div
          style={{
            position: 'absolute',
            bottom: '32px',
            right: '40px',
            fontSize: 16,
            color: '#525252',
            fontWeight: 500,
            display: 'flex',
          }}
        >
          ball-in-the-6.vercel.app
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
