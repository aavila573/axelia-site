import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate, Sequence } from 'remotion';

interface SlideProps {
  title: string;
  subtitle?: string;
  accentColor: string;
  delay?: number;
}

const Slide: React.FC<SlideProps> = ({ title, subtitle, accentColor, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame - delay * fps, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const translateY = spring({ frame: frame - delay * fps, fps, config: { damping: 15, stiffness: 80 } });

  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center',
      padding: 80,
    }}>
      <div style={{
        opacity,
        transform: `translateY(${(1 - translateY) * 30}px)`,
        textAlign: 'center',
      }}>
        <div style={{
          width: 60, height: 4, background: accentColor,
          margin: '0 auto 24px', borderRadius: 2,
        }} />
        <h1 style={{
          fontSize: 56, fontWeight: 800, color: 'white',
          fontFamily: 'Arial, sans-serif', margin: 0,
          lineHeight: 1.3,
        }}>{title}</h1>
        {subtitle && (
          <p style={{
            fontSize: 28, color: '#8888A0',
            fontFamily: 'Arial, sans-serif',
            marginTop: 16,
          }}>{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export const AxelIAReel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{
      flex: 1, background: '#0A0A0F',
      fontFamily: 'Arial, sans-serif',
    }}>
      {/* Gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, rgba(108,92,231,0.08) 0%, transparent 60%)',
      }} />

      <Sequence from={0} durationInFrames={90}>
        <Slide
          title="Tu PYME pierde horas\nen procesos manuales"
          accentColor="#FF4D6A"
        />
      </Sequence>

      <Sequence from={75} durationInFrames={90}>
        <Slide
          title="Automatizá todo\ncon agentes de IA"
          subtitle="Sin código, sin estrés, sin errores"
          accentColor="#6C5CE7"
        />
      </Sequence>

      <Sequence from={150} durationInFrames={110}>
        <Slide
          title="Atención 24/7\nCotizaciones\nReportes\nFacturación"
          subtitle="Todo lo repetitivo lo hace la IA"
          accentColor="#00D2A0"
        />
      </Sequence>

      <Sequence from={240} durationInFrames={90}>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center',
          background: 'linear-gradient(180deg, #0A0A0F 0%, #1A1040 100%)',
        }}>
          <h1 style={{ fontSize: 80, fontWeight: 900, color: '#6C5CE7', margin: 0 }}>
            AxelIA
          </h1>
          <p style={{ fontSize: 28, color: 'white', marginTop: 16 }}>
            Agentes de IA para PYMES Colombianas
          </p>
          <p style={{ fontSize: 22, color: '#8888A0', marginTop: 32 }}>
            axelia.tech
          </p>
        </div>
      </Sequence>
    </div>
  );
};
