export interface HotspotMetric {
  label: string;
  value: string;
}

export interface HotspotData {
  id: number;
  title: string;
  subtitle: string;
  position: [number, number, number];
  category: string;
  description: string;
  metrics: HotspotMetric[];
}
