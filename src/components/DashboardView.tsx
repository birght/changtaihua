import React from 'react';
import { Enterprise, CollectedProblem, VisitRecord } from '../types';
import { 
  Phone, 
  Building2, 
  AlertCircle, 
  CheckCircle2, 
  TrendingUp, 
  ArrowRight, 
  PieChart, 
  BarChart2, 
  Clock, 
  User 
} from 'lucide-react';

interface DashboardViewProps {
  scope: 'OWN' | 'ALL';
  setScope: (scope: 'OWN' | 'ALL') => void;
  enterprises: Enterprise[];
  problems: CollectedProblem[];
  visitRecords: VisitRecord[];
  onSelectEnterprise: (name: string) => void;
  onSelectProblem: (recordId: string) => void;
  onNavigateToTab: (tab: 'dashboard' | 'reminder' | 'records' | 'apis') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  scope,
  setScope,
  enterprises,
  problems,
  visitRecords,
  onSelectEnterprise,
  onSelectProblem,
  onNavigateToTab
}) => {
  // 1. Filtered datasets based on scope
  const filteredEnterprises = enterprises.filter(e => scope === 'ALL' || e.owner === 'OWN');
  const filteredProblems = problems.filter(p => scope === 'ALL' || p.owner === 'OWN');
  const filteredRecords = visitRecords.filter(r => scope === 'ALL' || r.owner === 'OWN');

  // 2. Calculations for KPIs
  const totalContacts = filteredRecords.length;
  
  // Contacted enterprises: distinct enterpriseId in submitted visitRecords
  const submittedRecords = filteredRecords.filter(r => r.recordStatus === 1);
  const contactedEntIds = new Set(submittedRecords.map(r => r.enterpriseId));
  const contactedCount = contactedEntIds.size;
  const associatedCount = filteredEnterprises.length;

  // Problems collected & overdue
  const collectedProblemsCount = filteredProblems.length;
  const overdueProblemsCount = filteredProblems.filter(p => p.isOverdue && p.status !== '已办结').length;

  // Resolution rate
  const resolvedProblems = filteredProblems.filter(p => p.status === '已办结');
  const resolvedCount = resolvedProblems.length;
  const resolutionRate = collectedProblemsCount > 0 
    ? Math.round((resolvedCount / collectedProblemsCount) * 1000) / 10 
    : 0;

  // 3. Problem Status Distribution (收集 -> 已转交 -> 办理中 -> 已办结)
  const statusCounts = {
    '收集': filteredProblems.filter(p => p.status === '收集').length,
    '已转交': filteredProblems.filter(p => p.status === '已转交').length,
    '办理中': filteredProblems.filter(p => p.status === '办理中').length,
    '已办结': filteredProblems.filter(p => p.status === '已办结').length,
  };

  // 4. Problem Categories Stats (惠企政策类, 融资贷款类, 人才需求类, 基础设施类, 证照办理类, 市场经营类, 其他类)
  const categories: CollectedProblem['category'][] = [
    '惠企政策类', '融资贷款类', '人才需求类', '基础设施类', '证照办理类', '市场经营类', '其他类'
  ];
  const categoryStats = categories.map(cat => {
    const catProblems = filteredProblems.filter(p => p.category === cat);
    const catResolved = catProblems.filter(p => p.status === '已办结');
    const rate = catProblems.length > 0 ? Math.round((catResolved.length / catProblems.length) * 100) : 0;
    return {
      category: cat,
      total: catProblems.length,
      resolved: catResolved.length,
      rate
    };
  });

  // 5. Overdue problems list
  const overdueList = filteredProblems
    .filter(p => p.isOverdue && p.status !== '已办结')
    .map(p => {
      // Find matching visit record for navigation
      const matchRecord = visitRecords.find(r => r.problems.some(prob => prob.id === p.id));
      return {
        ...p,
        visitRecordId: matchRecord?.id || 'rec-1'
      };
    });

  return (
    <div className="space-y-6">
      {/* 顶部标题与视角切换 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
        <div>
          <h3 className="text-base font-bold text-slate-800">联系走访与问题办结全景图</h3>
          <p className="text-xs text-slate-500 mt-1">系统融合市委省委包保责任制，追踪待联系、已收集问题全流程办结状态。</p>
        </div>
        
        {/* Radio 视角按钮组 */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 shrink-0">
          <button
            onClick={() => setScope('OWN')}
            className={`flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 cursor-pointer ${
              scope === 'OWN'
                ? 'bg-white text-blue-700 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>个人包保数据</span>
          </button>
          <button
            onClick={() => setScope('ALL')}
            className={`flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 cursor-pointer ${
              scope === 'ALL'
                ? 'bg-white text-blue-700 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>全市全景数据</span>
          </button>
        </div>
      </div>

      {/* 四项指标汇总卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-500">联系走访总次数</span>
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <Phone className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-slate-900 font-mono">{totalContacts}</span>
            <span className="text-xs text-slate-400 ml-1">次走访沟通</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex justify-between text-[11px] text-slate-500">
            <span>实地联系：{filteredRecords.filter(r => r.method === 'SDZF').length}次</span>
            <span>电话沟通：{filteredRecords.filter(r => r.method === 'DHGT').length}次</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-500">已联系企业数</span>
            <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <Building2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-slate-900 font-mono">{contactedCount}</span>
            <span className="text-xs text-slate-500 ml-1">/ {associatedCount} 家</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex justify-between text-[11px] text-slate-500">
            <span>本月联系率：{associatedCount > 0 ? Math.round((contactedCount / associatedCount) * 100) : 0}%</span>
            <button 
              onClick={() => onNavigateToTab('reminder')}
              className="text-blue-600 hover:underline font-semibold flex items-center gap-0.5 cursor-pointer"
            >
              <span>待联系提醒</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-500">收集企业诉求问题</span>
            <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
              <AlertCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-slate-900 font-mono">{collectedProblemsCount}</span>
            <span className="text-xs text-slate-400 ml-1">个诉求</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex justify-between text-[11px] text-slate-500">
            <span className="text-rose-600 font-semibold flex items-center gap-0.5">
              <Clock className="w-3 h-3" />
              <span>超期未办：{overdueProblemsCount}个</span>
            </span>
            <span>草稿问题：0个</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-500">问题办结率 %</span>
            <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-slate-900 font-mono">{resolutionRate}%</span>
            <span className="text-xs text-slate-400 ml-1">办结指标</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex justify-between text-[11px] text-slate-500">
            <span>已成功办结：{resolvedCount}个</span>
            <span>办结审核中：{filteredProblems.filter(p => p.status === '办理中').length}个</span>
          </div>
        </div>
      </div>

      {/* 图表分析网格 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 问题状态分布 (饼图+进度条) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
              <PieChart className="w-4 h-4 text-blue-600" />
              <span>问题办理状态链条分布</span>
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">共收集 {collectedProblemsCount} 项</span>
          </div>

          <div className="space-y-4">
            {/* 流程演化流式表达图 */}
            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100 text-center gap-1">
              <div className="flex-1">
                <div className="text-[10px] text-slate-400">1. 收集</div>
                <div className="text-xs font-bold text-slate-700 mt-0.5">{statusCounts['收集']}</div>
              </div>
              <div className="text-slate-300 text-xs font-mono">→</div>
              <div className="flex-1">
                <div className="text-[10px] text-amber-500 font-semibold">2. 已转交</div>
                <div className="text-xs font-bold text-slate-700 mt-0.5">{statusCounts['已转交']}</div>
              </div>
              <div className="text-slate-300 text-xs font-mono">→</div>
              <div className="flex-1">
                <div className="text-[10px] text-blue-500 font-semibold">3. 办理中</div>
                <div className="text-xs font-bold text-slate-700 mt-0.5">{statusCounts['办理中']}</div>
              </div>
              <div className="text-slate-300 text-xs font-mono">→</div>
              <div className="flex-1">
                <div className="text-[10px] text-emerald-500 font-semibold">4. 已办结</div>
                <div className="text-xs font-bold text-emerald-600 mt-0.5">{statusCounts['已办结']}</div>
              </div>
            </div>

            {/* 进度条明细 */}
            <div className="space-y-2.5 pt-1">
              <div>
                <div className="flex justify-between text-[11px] mb-1 text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                    <span>收集状态</span>
                  </span>
                  <span className="font-mono">{statusCounts['收集']} 个 / {collectedProblemsCount > 0 ? Math.round(statusCounts['收集']/collectedProblemsCount*100) : 0}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-slate-400 h-full rounded-full" style={{ width: `${collectedProblemsCount > 0 ? (statusCounts['收集']/collectedProblemsCount)*100 : 0}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1 text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <span>已转交办理</span>
                  </span>
                  <span className="font-mono">{statusCounts['已转交']} 个 / {collectedProblemsCount > 0 ? Math.round(statusCounts['已转交']/collectedProblemsCount*100) : 0}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: `${collectedProblemsCount > 0 ? (statusCounts['已转交']/collectedProblemsCount)*100 : 0}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1 text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span>正在解决中</span>
                  </span>
                  <span className="font-mono">{statusCounts['办理中']} 个 / {collectedProblemsCount > 0 ? Math.round(statusCounts['办理中']/collectedProblemsCount*100) : 0}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: `${collectedProblemsCount > 0 ? (statusCounts['办理中']/collectedProblemsCount)*100 : 0}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1 text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>已圆满办结</span>
                  </span>
                  <span className="font-mono text-emerald-600 font-bold">{statusCounts['已办结']} 个 / {collectedProblemsCount > 0 ? Math.round(statusCounts['已办结']/collectedProblemsCount*100) : 0}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${collectedProblemsCount > 0 ? (statusCounts['已办结']/collectedProblemsCount)*100 : 0}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 问题类别统计 (柱状图/进度卡片) */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-blue-600" />
              <span>各诉求类别分布及办结率明细</span>
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">按类型分类排序</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 max-h-[295px] overflow-y-auto pr-1">
            {categoryStats.map((stat, idx) => (
              <div key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-150 flex flex-col justify-between">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-700 truncate max-w-[120px]">{stat.category}</span>
                  <span className="text-[10px] font-mono font-semibold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-100">
                    办结率：{stat.rate}%
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-500 mt-1">
                  <span>总计：{stat.total} 个问题</span>
                  <span className="text-emerald-600">已办结：{stat.resolved} 个</span>
                </div>
                <div className="w-full bg-slate-200/60 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${stat.rate}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 数据表格联通面板 */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* 关联企业表格 */}
        <div className="xl:col-span-5 bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200/60 flex justify-between items-center">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-indigo-500" />
              <span>本辖区关联包保企业一览</span>
            </h4>
            <span className="text-[10px] bg-slate-200 text-slate-600 font-bold font-mono px-2 py-0.5 rounded-full">
              {filteredEnterprises.length} 家
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 bg-slate-50/50 border-b border-slate-150 uppercase text-[10px] tracking-wider">
                  <th className="px-4 py-2 font-bold">企业名称</th>
                  <th className="px-4 py-2 font-bold">专员联系人</th>
                  <th className="px-4 py-2 font-bold">联系电话</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEnterprises.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-slate-400 italic">
                      暂无挂载包保责任的企业。
                    </td>
                  </tr>
                ) : (
                  filteredEnterprises.map(ent => (
                    <tr 
                      key={ent.id} 
                      onClick={() => onSelectEnterprise(ent.name)}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                      title="点击跳转企业联系提醒卡片"
                    >
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                          <span>{ent.name}</span>
                          <span className={`text-[8px] px-1 rounded-sm font-bold font-mono ${
                            ent.level === '一类' ? 'bg-blue-100 text-blue-800' :
                            ent.level === '二类' ? 'bg-amber-100 text-amber-800' :
                            'bg-emerald-100 text-emerald-800'
                          }`}>{ent.level}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{ent.industry} · {ent.scale}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 font-semibold">{ent.contactPerson}</td>
                      <td className="px-4 py-3 text-slate-500 font-mono">{ent.contactPhone}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 超期未解决诉求表格 */}
        <div className="xl:col-span-7 bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200/60 flex justify-between items-center">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-rose-500 shrink-0" />
              <span>超期未走访办结问题红色预警</span>
            </h4>
            <span className="text-[10px] bg-rose-100 text-rose-700 font-bold font-mono px-2 py-0.5 rounded-full animate-pulse">
              {overdueList.length} 项超期
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 bg-slate-50/50 border-b border-slate-150 uppercase text-[10px] tracking-wider">
                  <th className="px-4 py-2 font-bold">问题诉求摘要</th>
                  <th className="px-4 py-2 font-bold">关联责任企业</th>
                  <th className="px-4 py-2 font-bold text-center">超期天数</th>
                  <th className="px-4 py-2 font-bold">限办截止日期</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {overdueList.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-emerald-500 font-semibold italic">
                      太棒了！当前没有任何超期未办结的问题，系统指标优秀。
                    </td>
                  </tr>
                ) : (
                  overdueList.map(prob => (
                    <tr 
                      key={prob.id} 
                      onClick={() => onSelectProblem(prob.visitRecordId)}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                      title="点击自动切换至走访记录并展开该问题详情抽屉"
                    >
                      <td className="px-4 py-3 max-w-sm">
                        <div className="text-slate-800 group-hover:text-blue-600 transition-colors font-semibold truncate leading-tight" title={prob.summary}>
                          {prob.summary}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-2">
                          <span className="bg-slate-100 text-slate-600 px-1 py-0.2 rounded">{prob.category}</span>
                          <span className="text-rose-500 font-bold bg-rose-50 px-1 rounded">逾期警戒</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 font-medium">{prob.enterpriseName}</td>
                      <td className="px-4 py-3 text-center text-rose-600 font-mono font-extrabold text-sm">{prob.overdueDays} 天</td>
                      <td className="px-4 py-3 text-slate-500 font-mono">{prob.dueDate}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
