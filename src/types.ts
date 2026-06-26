/**
 * 政企联系走访与问题办结管理系统 - 类型声明
 */

export interface Enterprise {
  id: string;
  name: string;
  industry: string;
  industryCategory: string;
  scale: string;
  contactPerson: string;
  contactPhone: string;
  address: string;
  responsibleUnit: string;
  provinceLeader: string;
  cityLeader: string;
  level: '一类' | '二类' | '三类';
  dueDate: string;
  daysLeft: number;
  visitCount: number;
  lastVisitDate: string;
  lastVisitSummary: string;
  owner: 'OWN' | 'ALL';
}

export interface CollectedProblem {
  id: string;
  summary: string;
  enterpriseName: string;
  enterpriseId: string;
  category: '惠企政策类' | '融资贷款类' | '人才需求类' | '基础设施类' | '证照办理类' | '市场经营类' | '其他类';
  status: '收集' | '已转交' | '办理中' | '已办结';
  dueDate: string;
  overdueDays: number;
  isOverdue: boolean;
  owner: 'OWN' | 'ALL';
}

export interface VisitRecord {
  id: string;
  enterpriseId: string;
  enterpriseName: string;
  createTime: string;
  method: 'SDZF' | 'DHGT'; // SDZF: 实地走访, DHGT: 电话沟通
  recordStatus: 0 | 1; // 0: 草稿, 1: 已提交
  problemCount: number;
  activeProblemCount: number;
  latestSummary: string;
  problems: {
    id: string;
    summary: string;
    category: CollectedProblem['category'];
    status: CollectedProblem['status'];
    dueDate: string;
  }[];
  owner: 'OWN' | 'ALL';
}

export interface ApiCallLog {
  timestamp: string;
  url: string;
  method: string;
  params?: string;
  response: string;
}
