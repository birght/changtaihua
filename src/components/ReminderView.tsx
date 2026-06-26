import React, { useState, useEffect } from 'react';
import { Enterprise, VisitRecord } from '../types';
import { 
  Search, 
  Filter, 
  RefreshCw, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  UserCheck, 
  ChevronDown, 
  ChevronUp, 
  AlertTriangle,
  FileText,
  Plus
} from 'lucide-react';

interface ReminderViewProps {
  enterprises: Enterprise[];
  visitRecords: VisitRecord[];
  onAddContactForEnterprise: (entId: string, entName: string) => void;
  onViewEnterpriseDetails: (entId: string) => void;
  searchFilterQuery?: string; // Optional incoming query from dashboard click
}

export const ReminderView: React.FC<ReminderViewProps> = ({
  enterprises,
  visitRecords,
  onAddContactForEnterprise,
  onViewEnterpriseDetails,
  searchFilterQuery = ''
}) => {
  // State for search filters
  const [searchTerm, setSearchTerm] = useState(searchFilterQuery);
  const [selectedLevel, setSelectedLevel] = useState<string>('全部');
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  useEffect(() => {
    if (searchFilterQuery) {
      setSearchTerm(searchFilterQuery);
      // Auto expand the first matching enterprise
      const matched = enterprises.find(e => e.name.toLowerCase().includes(searchFilterQuery.toLowerCase()));
      if (matched) {
        setExpandedCardId(matched.id);
      }
    }
  }, [searchFilterQuery, enterprises]);

  // Handle reset filters
  const handleReset = () => {
    setSearchTerm('');
    setSelectedLevel('全部');
    setExpandedCardId(null);
  };

  // Filter enterprises
  const filteredEnterprises = enterprises.filter(ent => {
    const matchesSearch = ent.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === '全部' || ent.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  // Calculate statistics for pending monthly contacts
  const totalPending = enterprises.length;
  const level1Count = enterprises.filter(e => e.level === '一类').length;
  const level2Count = enterprises.filter(e => e.level === '二类').length;
  const level3Count = enterprises.filter(e => e.level === '三类').length;

  // Earliest deadline
  const sortedByDeadline = [...enterprises].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const earliestDeadline = sortedByDeadline.length > 0 ? sortedByDeadline[0].dueDate : '无';

  // Toggle card collapse
  const toggleCard = (id: string) => {
    if (expandedCardId === id) {
      setExpandedCardId(null);
    } else {
      setExpandedCardId(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* 顶部统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1 */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-md">
          <div className="flex items-center justify-between opacity-90">
            <span className="text-xs font-semibold uppercase tracking-wider">本月待联络企业</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono">{totalPending}</span>
            <span className="text-xs opacity-80">家责任包保企业</span>
          </div>
          <p className="text-[11px] opacity-75 mt-2 leading-relaxed">系统根据包保层级周期性（一类每月走访，二/三类双月及每季）计算自动生成。</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">待联络包保分级统计</span>
            <Filter className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="bg-blue-50 p-1.5 rounded border border-blue-100">
              <div className="text-[10px] text-blue-700 font-bold">一类 (高)</div>
              <div className="text-sm font-bold text-blue-800 font-mono mt-0.5">{level1Count}家</div>
            </div>
            <div className="bg-amber-50 p-1.5 rounded border border-amber-100">
              <div className="text-[10px] text-amber-700 font-bold">二类 (中)</div>
              <div className="text-sm font-bold text-amber-800 font-mono mt-0.5">{level2Count}家</div>
            </div>
            <div className="bg-emerald-50 p-1.5 rounded border border-emerald-100">
              <div className="text-[10px] text-emerald-700 font-bold">三类 (低)</div>
              <div className="text-sm font-bold text-emerald-800 font-mono mt-0.5">{level3Count}家</div>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">最早联系限期截至日期</span>
            <Calendar className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-3">
            <div className="text-base font-bold text-rose-600 font-mono flex items-center gap-1">
              <AlertTriangle className="w-4 h-4 shrink-0 animate-bounce text-rose-500" />
              <span>{earliestDeadline}</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-2">
              辖区内有企业联系任务即将到期，请尽快妥善安排走访联络！
            </div>
          </div>
        </div>
      </div>

      {/* 筛选栏 */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex flex-1 flex-col sm:flex-row gap-3 w-full">
          {/* Priority filter */}
          <div className="w-full sm:w-48">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full bg-white text-xs border border-slate-300 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium"
            >
              <option value="全部">🔍 包保分类：全部</option>
              <option value="一类">🔵 一类包保企业 (重点)</option>
              <option value="二类">🟡 二类包保企业 (中等)</option>
              <option value="三类">🟢 三类包保企业 (常规)</option>
            </select>
          </div>

          {/* Search box */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="输入企业名称、行业或包保专员进行模糊查询..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Action buttons */}
        <button
          onClick={handleReset}
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>重置条件</span>
        </button>
      </div>

      {/* 企业卡片列表 */}
      <div className="space-y-3.5">
        {filteredEnterprises.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400">
            没有找到匹配您筛选条件的待联系企业提醒。
          </div>
        ) : (
          filteredEnterprises.map(ent => {
            const isExpanded = expandedCardId === ent.id;
            const isNearOverdue = ent.daysLeft <= 7;
            
            return (
              <div 
                key={ent.id}
                className={`bg-white border rounded-xl overflow-hidden shadow-sm transition-all duration-200 ${
                  isExpanded ? 'ring-2 ring-blue-500 border-transparent shadow-md' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Collapsed top bar */}
                <div 
                  onClick={() => toggleCard(ent.id)}
                  className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer select-none bg-white hover:bg-slate-50/50"
                >
                  <div className="flex items-start gap-3">
                    {/* Level marker dot */}
                    <span className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ${
                      ent.level === '一类' ? 'bg-blue-600' :
                      ent.level === '二类' ? 'bg-amber-500' :
                      'bg-emerald-500'
                    }`} />
                    
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-slate-900 leading-snug">{ent.name}</h4>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                          ent.level === '一类' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                          ent.level === '二类' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                          'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        }`}>
                          {ent.level}包保企业
                        </span>
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
                          {ent.industryCategory}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1 flex items-center gap-4 flex-wrap">
                        <span>责任包保部门：<strong className="text-slate-700">{ent.responsibleUnit}</strong></span>
                        <span>累计已联系：<strong className="text-slate-700 font-mono">{ent.visitCount}次</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Left days alert indicator */}
                  <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 border-slate-100 pt-2.5 md:pt-0">
                    <div className="text-left md:text-right">
                      <div className="text-[11px] text-slate-400 font-medium">任务限期截止时间</div>
                      <div className="text-xs font-bold text-slate-700 font-mono mt-0.5 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{ent.dueDate}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[11px] text-slate-400 font-medium">走访剩余时间</div>
                      <div className={`text-xs font-bold font-mono mt-0.5 px-2.5 py-0.5 rounded-full inline-block ${
                        isNearOverdue 
                          ? 'bg-rose-50 text-rose-600 border border-rose-200 animate-pulse' 
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {isNearOverdue ? `🚨 仅剩 ${ent.daysLeft} 天` : `还剩 ${ent.daysLeft} 天`}
                      </div>
                    </div>

                    <div className="text-slate-400 shrink-0 hidden md:block">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2.5 border-t border-slate-100 bg-slate-50/50 space-y-4 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      {/* Left: enterprise basic metadata */}
                      <div className="md:col-span-7 space-y-2.5">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">企业基本联系档案</div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center gap-2">
                            <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                            <div>
                              <div className="text-[10px] text-slate-400">专员及联络方式</div>
                              <div className="font-bold text-slate-800 mt-0.5">{ent.contactPerson} ({ent.contactPhone})</div>
                            </div>
                          </div>

                          <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center gap-2">
                            <UserCheck className="w-4 h-4 text-slate-400 shrink-0" />
                            <div>
                              <div className="text-[10px] text-slate-400">省 / 市包保责任领导</div>
                              <div className="font-bold text-slate-800 mt-0.5">
                                {ent.provinceLeader !== '无' ? ent.provinceLeader : ''}
                                {ent.provinceLeader !== '无' && ent.cityLeader !== '无' ? ' / ' : ''}
                                {ent.cityLeader !== '无' ? ent.cityLeader : '无挂载'}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-start gap-2 text-xs">
                          <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-[10px] text-slate-400">企业注册及生产经营地址</div>
                            <div className="font-medium text-slate-700 mt-0.5">{ent.address}</div>
                          </div>
                        </div>
                      </div>

                      {/* Right: history visit snapshot */}
                      <div className="md:col-span-5 bg-white p-3 rounded-lg border border-slate-200 flex flex-col justify-between">
                        <div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                            <span>上次走访对接摘要</span>
                            <span className="font-mono text-[9px] text-slate-500">走访日期：{ent.lastVisitDate}</span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed italic">
                            {ent.lastVisitSummary}
                          </p>
                        </div>
                        
                        {/* Detail Trigger */}
                        <div className="mt-3 text-right">
                          <button 
                            onClick={() => onViewEnterpriseDetails(ent.id)}
                            className="text-xs text-blue-600 hover:text-blue-700 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>查阅更早的历史走访全案</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Actions bar */}
                    <div className="pt-3 border-t border-slate-200/60 flex flex-col sm:flex-row sm:justify-end gap-2.5">
                      <button
                        onClick={() => onAddContactForEnterprise(ent.id, ent.name)}
                        className="flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-md active:scale-95 transition-all cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>新增联系走访对接记录</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
