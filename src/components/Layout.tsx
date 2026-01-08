'use client';

import { useMemo, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

import { Navbar } from './Navbar';
import Footer from './Footer';
import FloatingWhatsAppButton from './FloatingWhatsAppButton';
import { ScrollProgress } from './ScrollProgress';

interface LayoutProps {
  children: ReactNode;
}

type GradientLayer = {
  image: string;
  size?: string;
  position?: string;
  repeat?: string;
  attachment?: string;
  animatePosition?: string;
};

type GradientConfig = {
  matcher: RegExp;
  key: string;
  layers: GradientLayer[];
  veil?: {
    background: string;
    opacity: number;
  };
};

const nightLayers: GradientLayer[] = [
  {
    image: 'linear-gradient(180deg, #FFF8F0 0%, #FFF5EB 25%, #FFFBF5 50%, #F5EFE6 75%, #F0E6DC 100%)',
    size: '100% 100%',
    position: '50% 50%',
    animatePosition: '50% 50%'
  },
  {
    image: 'radial-gradient(70% 60% at 30% 20%, rgba(232, 107, 50, 0.03) 0%, rgba(232, 107, 50, 0) 70%)',
    size: '120% 120%',
    position: '30% 20%',
    animatePosition: '35% 25%'
  },
  {
    image: 'radial-gradient(80% 70% at 70% 80%, rgba(245, 180, 130, 0.04) 0%, rgba(245, 180, 130, 0) 70%)',
    size: '130% 130%',
    position: '70% 80%',
    animatePosition: '65% 75%'
  },
  {
    image: 'radial-gradient(60% 50% at 50% 50%, rgba(255, 248, 240, 0) 0%, rgba(255, 248, 240, 0) 100%)',
    size: '100% 100%',
    position: '50% 50%',
    animatePosition: '50% 50%'
  }
];

const lightLayers: GradientLayer[] = [
  {
    image: 'radial-gradient(140% 125% at 24% 8%, #fdf7ef 0%, #f0f8f6 42%, #e3f2fd 100%)',
    size: '150% 150%',
    position: '24% 10%',
    animatePosition: '30% 16%'
  },
  {
    image: 'radial-gradient(78% 60% at 82% 12%, rgba(74, 189, 198, 0.24) 0%, rgba(74, 189, 198, 0) 68%)',
    size: '120% 120%',
    position: '78% 12%',
    animatePosition: '84% 18%'
  },
  {
    image: 'radial-gradient(90% 72% at 20% 88%, rgba(255, 160, 105, 0.22) 0%, rgba(255, 160, 105, 0) 82%)',
    size: '140% 140%',
    position: '20% 86%',
    animatePosition: '16% 80%'
  },
  {
    image: 'radial-gradient(120% 120% at 50% 65%, rgba(255, 255, 255, 0.72) 0%, rgba(255, 255, 255, 0) 72%)',
    size: '130% 130%',
    position: '50% 66%',
    animatePosition: '48% 60%'
  }
];

const emeraldLayers: GradientLayer[] = [
  {
    image: 'radial-gradient(140% 140% at 28% 12%, #F0FDF4 0%, #DCFCE7 42%, #BBF7D0 80%, #86EFAC 100%)',
    size: '150% 150%',
    position: '28% 14%',
    animatePosition: '24% 20%'
  },
  {
    image: 'radial-gradient(72% 64% at 80% 18%, rgba(126, 235, 170, 0.2) 0%, rgba(126, 235, 170, 0) 70%)',
    size: '125% 125%',
    position: '82% 16%',
    animatePosition: '76% 22%'
  },
  {
    image: 'radial-gradient(88% 70% at 22% 86%, rgba(20, 184, 166, 0.15) 0%, rgba(20, 184, 166, 0) 80%)',
    size: '135% 135%',
    position: '20% 88%',
    animatePosition: '26% 82%'
  },
  {
    image: 'radial-gradient(118% 118% at 50% 55%, rgba(240, 253, 244, 0) 0%, rgba(240, 253, 244, 0.5) 78%, rgba(240, 253, 244, 0.8) 100%)',
    size: '115% 115%',
    position: '50% 54%',
    animatePosition: '52% 58%'
  }
];

const gradientConfigs: GradientConfig[] = [
  {
    matcher: /^\/$/,
    key: 'home',
    layers: nightLayers,
    veil: {
      background: 'radial-gradient(120% 120% at 50% 0%, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 100%)',
      opacity: 0
    }
  },
  {
    matcher: /^\/(destinations|trips|trip-options|route-builder)(\/.*)?$/,
    key: 'voyage',
    layers: nightLayers,
    veil: {
      background: 'radial-gradient(120% 120% at 50% 0%, rgba(20, 184, 166, 0.15) 0%, rgba(255, 248, 240, 0.3) 45%, rgba(255, 255, 255, 0) 100%)',
      opacity: 0.5
    }
  },
  {
    matcher: /^\/(popular-trips|destinations\/[^/]+)$/,
    key: 'popular',
    layers: nightLayers,
    veil: {
      background: 'radial-gradient(120% 120% at 85% 10%, rgba(249, 115, 22, 0.18) 0%, rgba(255, 248, 240, 0.2) 70%)',
      opacity: 0.4
    }
  },
  {
    matcher: /^\/local-getaways(\/.*)?$/,
    key: 'emerald',
    layers: emeraldLayers,
    veil: {
      background: 'radial-gradient(120% 120% at 50% 0%, rgba(126, 235, 170, 0.15) 0%, rgba(240, 253, 244, 0.3) 65%, rgba(255, 255, 255, 0) 100%)',
      opacity: 0.4
    }
  },
  {
    matcher: /^\/(about|faqs|contact|how-it-works)(\/.*)?$/,
    key: 'light',
    layers: lightLayers,
    veil: {
      background: 'radial-gradient(120% 130% at 50% 0%, rgba(255, 255, 255, 0.65) 0%, rgba(255, 255, 255, 0.18) 55%, rgba(240, 249, 255, 0) 100%)',
      opacity: 0.9
    }
  }
];

const defaultConfig: GradientConfig = {
  matcher: /.*/,
  key: 'default',
  layers: nightLayers,
  veil: {
    background: 'radial-gradient(120% 120% at 50% 0%, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 100%)',
    opacity: 0
  }
};

const noiseTexture =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEyOCIgaGVpZ2h0PSIxMjgiIGZpbGw9IiMwMDAiLz48ZmlsdGVyIGlkPSJmIiB4PSIwIiB5PSIwIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiPjxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbExpbmFyIiBiYXNlRnJlcXVlbmN5PSIwLjgiIG51bU9jdGF2ZXM9IjEiLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgc3R5bGU9ImZpbHRlcjp1cmwoI2YpOyBvcGFjaXR5OjAuMTI7Ii8+PC9zdmc+';

const composeLayerProperty = (layers: GradientLayer[], key: keyof GradientLayer, fallback: string) =>
  layers
    .map((layer) => layer[key] ?? fallback)
    .join(', ');

const Layout = ({ children }: LayoutProps) => {
  const pathname = usePathname();

  const activeConfig = useMemo(() => {
    const match = gradientConfigs.find(({ matcher }) => matcher.test(pathname));
    return match ?? defaultConfig;
  }, [pathname]);

  const gradientImages = useMemo(
    () => composeLayerProperty(activeConfig.layers, 'image', nightLayers[0].image),
    [activeConfig]
  );

  const gradientSizes = useMemo(
    () => composeLayerProperty(activeConfig.layers, 'size', '100% 100%'),
    [activeConfig]
  );

  const gradientPositions = useMemo(
    () => composeLayerProperty(activeConfig.layers, 'position', '50% 50%'),
    [activeConfig]
  );

  const gradientAnimatePositions = useMemo(
    () => composeLayerProperty(activeConfig.layers, 'animatePosition', '50% 50%'),
    [activeConfig]
  );

  const gradientAttachment = useMemo(
    () => composeLayerProperty(activeConfig.layers, 'attachment', 'fixed'),
    [activeConfig]
  );

  const gradientRepeat = useMemo(
    () => composeLayerProperty(activeConfig.layers, 'repeat', 'no-repeat'),
    [activeConfig]
  );

  const veilSettings = activeConfig.veil ?? defaultConfig.veil;

  const isRouteBuilder = pathname?.startsWith('/route-builder');
  const isHub = pathname?.startsWith('/hub');
  const isDiscover = pathname?.startsWith('/discover');

  return (
    <div className="relative min-h-screen flex flex-col text-foreground">
      {!isRouteBuilder && !isHub && !isDiscover && <Navbar />}
      {!isRouteBuilder && !isHub && !isDiscover && <ScrollProgress />}
      <AnimatePresence mode="wait">
        <motion.div
          key={`gradient-${activeConfig.key}`}
          className="pointer-events-none fixed inset-0 -z-30"
          style={{
            backgroundImage: gradientImages,
            backgroundSize: gradientSizes,
            backgroundPosition: gradientPositions,
            backgroundRepeat: gradientRepeat,
            backgroundAttachment: gradientAttachment,
            filter: 'saturate(112%)'
          }}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1, backgroundPosition: gradientAnimatePositions }}
          exit={{ opacity: 0, scale: 0.985 }}
          transition={{
            opacity: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
            scale: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
            backgroundPosition: { duration: 18, ease: 'linear', repeat: Infinity, repeatType: 'reverse' }
          }}
        />
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {veilSettings && (
          <motion.div
            key={`veil-${activeConfig.key}`}
            className="pointer-events-none fixed inset-0 -z-20"
            style={{
              backgroundImage: `${veilSettings.background}, url(${noiseTexture})`,
              backgroundBlendMode: 'screen, normal',
              backgroundSize: '140% 140%, 220px 220px',
              backgroundRepeat: 'no-repeat, repeat',
              mixBlendMode: 'normal'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: veilSettings.opacity }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
      </AnimatePresence>

      <main className="relative z-10 flex-grow">
        {children}
      </main>
      {!isHub && !isDiscover && <Footer />}
      {!isHub && !isDiscover && <FloatingWhatsAppButton />}
    </div>
  );
};

export default Layout;
