export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type AssetStatus = 'healthy' | 'warning' | 'critical' | 'offline';
export type AssetType =
  | 'gateway'
  | 'firewall'
  | 'server'
  | 'database'
  | 'medical-device'
  | 'workstation'
  | 'admin'
  | 'iot'
  | 'network';

export type Criticality = 'critical' | 'high' | 'medium' | 'low';

export interface PortInfo {
  port: number;
  protocol: 'TCP' | 'UDP';
  service: string;
  version: string;
  state: 'open' | 'closed' | 'filtered';
  expected: boolean;
  risk: Severity | 'none';
  riskScore: number;
}

export interface Vulnerability {
  id: string;
  severity: Severity;
  finding: string;
  assetId: string;
  assetName: string;
  service: string;
  riskScore: number;
  detected: string;
  status: 'open' | 'remediated' | 'in-progress' | 'verified';
  description: string;
  technicalDetails: string;
  healthcareImpact: string;
  recommendation: string;
  cve?: string;
}

export interface NetworkEvent {
  id: string;
  timestamp: string;
  source: string;
  destination: string;
  type: string;
  description: string;
  severity: Severity;
}

export interface Asset {
  id: string;
  name: string;
  ip: string;
  mac: string;
  type: AssetType;
  typeName: string;
  os: string;
  criticality: Criticality;
  status: AssetStatus;
  riskScore: number;
  lastSeen: string;
  lastScan: string;
  openPorts: PortInfo[];
  services: string[];
  vulnerabilities: string[];
  recentActivity: string;
  x: number;
  y: number;
}

export interface Incident {
  id: string;
  severity: Severity;
  type: string;
  affectedAsset: string;
  affectedAssetId: string;
  detected: string;
  aiConfidence: number;
  status: 'open' | 'investigating' | 'contained' | 'resolved';
  summary: string;
  timeline: { time: string; event: string }[];
  aiAnalysis: string;
  riskScore: number;
  relatedEvents: string[];
  recommendedActions: string[];
  correlatedEvents: { type: string; description: string }[];
  correlationSummary: string;
}

export interface Remediation {
  id: string;
  finding: string;
  assetId: string;
  assetName: string;
  action: string;
  clinicalImpact: string;
  approval: 'pending' | 'approved' | 'rejected';
  status: 'awaiting' | 'in-progress' | 'applied' | 'verified' | 'failed';
  steps: { label: string; done: boolean }[];
  beforeScore: number;
  afterScore: number;
  port?: number;
}

export interface AIInsight {
  id: string;
  title: string;
  source: string;
  destination: string;
  pattern: string;
  classification: string;
  confidence: number;
  severity: Severity;
  reasons: string[];
  timeline: { time: string; event: string }[];
  riskFactors: { label: string; score: number }[];
  finalRisk: number;
}

export interface ScanResult {
  ip: string;
  port: number;
  protocol: 'TCP' | 'UDP';
  service: string;
  version: string;
  state: 'open' | 'closed' | 'filtered';
  expected: boolean;
  risk: Severity | 'none';
  riskScore: number;
}

export type PageId =
  | 'overview'
  | 'network-map'
  | 'network-discovery'
  | 'port-scanner'
  | 'assets'
  | 'vulnerabilities'
  | 'ai-analyst'
  | 'threat-detection'
  | 'incidents'
  | 'remediation'
  | 'reports'
  | 'settings';
