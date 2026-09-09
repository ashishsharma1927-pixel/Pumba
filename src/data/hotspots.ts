import type { HotspotData } from '../types/hotspot';

export const HOTSPOTS: HotspotData[] = [
  {
    id: 1,
    title: 'Precision Audio',
    subtitle: 'Bionic Acoustic Chamber',
    category: 'ACOUSTICS',
    position: [2.05, -0.2, 0.4],
    description:
      'Custom 40mm beryllium diaphragms tuned for holographic spatial precision, rendering micro-details with virtually zero harmonic distortion.',
    metrics: [
      { label: 'Harmonic Distortion', value: '< 0.008%' },
      { label: 'Frequency Band', value: '5Hz - 48kHz' },
    ],
  },
  {
    id: 2,
    title: 'Adaptive Comfort',
    subtitle: 'Zero-Fatigue Ergonomics',
    category: 'ERGONOMICS',
    position: [0, 2.35, 0],
    description:
      'Aerospace-grade magnesium architecture paired with viscoelastic memory foam cushions engineered to eliminate pressure points across all-day listening.',
    metrics: [
      { label: 'Total Weight', value: '245g Ultralight' },
      { label: 'Clamp Force', value: 'Auto-balanced' },
    ],
  },
  {
    id: 3,
    title: '24 Hour Battery',
    subtitle: 'Graphene Power Core',
    category: 'POWER MATRIX',
    position: [-1.95, -1.05, 0.3],
    description:
      'High-energy density solid-state cell supporting continuous lossless wireless playback, with HyperCharge technology delivering 5 hours of playback in 10 minutes.',
    metrics: [
      { label: 'Playback Time', value: '24 Hours' },
      { label: 'Rapid Charge', value: '10m for 5h' },
    ],
  },
];
