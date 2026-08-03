import { Composition } from 'remotion';
import { AxelIAReel } from './Composition';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="AxelIAReel"
      component={AxelIAReel}
      durationInFrames={330}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
