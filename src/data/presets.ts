import { PresetScenario } from '../types/network';

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'optimal-wifi',
    title: 'Ideal 5GHz Wi-Fi (Near Router)',
    description: 'Line of sight to router with high throughput and low jitter.',
    iconName: 'Wifi',
    data: {
      rssi: -42,
      speed: 150,
      latency: 18,
      packetLoss: 0,
      networkType: 'Wi-Fi',
      locationLabel: 'Living Room (3m from Router)',
    },
  },
  {
    id: 'attenuated-room',
    title: 'Weak Bedroom Wi-Fi (Thick Walls)',
    description: 'High distance and structural obstacles degrading signal reception.',
    iconName: 'Home',
    data: {
      rssi: -78,
      speed: 14,
      latency: 75,
      packetLoss: 1.2,
      networkType: 'Wi-Fi',
      locationLabel: 'Upstairs Bedroom',
    },
  },
  {
    id: 'congested-cafe',
    title: 'Congested Public Hotspot',
    description: 'High latency and packet collisions caused by numerous active devices.',
    iconName: 'Coffee',
    data: {
      rssi: -66,
      speed: 8,
      latency: 140,
      packetLoss: 4.5,
      networkType: 'Wi-Fi',
      locationLabel: 'Busy Coffee Shop',
    },
  },
  {
    id: 'fringe-cellular',
    title: 'Cellular 4G/5G Fringe Area',
    description: 'Marginal cell tower coverage with call drop vulnerability.',
    iconName: 'Radio',
    data: {
      rssi: -86,
      speed: 6,
      latency: 95,
      packetLoss: 2.8,
      networkType: 'Mobile Data',
      locationLabel: 'Basement / Edge of Coverage',
    },
  },
  {
    id: 'packet-loss-spike',
    title: 'Severe Interference & Jitter',
    description: 'Microwave/neighboring channel overlap causing packet loss.',
    iconName: 'ZapOff',
    data: {
      rssi: -62,
      speed: 35,
      latency: 185,
      packetLoss: 7.2,
      networkType: 'Wi-Fi',
      locationLabel: 'Kitchen / Microwave active',
    },
  },
];
