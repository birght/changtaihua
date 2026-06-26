import React from 'react';
import { VisitRecord } from '../types';
import { 
  X, 
  Calendar, 
  Phone, 
  Building2, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  User, 
  ArrowRight,
  Clock,
  Briefcase,
  FileText
} from 'lucide-react';

interface DetailDrawerProps {
  record: VisitRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitDraft?: (id: string) => void;
}

export const DetailDrawer: React.FC<DetailDrawerProps> = ({
  record,
  isOpen,
  onClose,
  onSubmitDraft
}) => {
  if (!isOpen || !record) return null;

  const isDraft = record.recordStatus === 0;

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-fade-in">
      {/* Backdrop overlay */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" 
      />

      {/* Drawer box */}
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-left">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4.5 h-4.5 text-blue-600" />
            <div>
              <h4 className="text-sm font-bold text-slate-950 truncate max-w-[280px]">走访联络对接档案详情</h4>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">ID: {record.id}</p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin">
          {/* Metadata Section */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3.5">
            <div className="font-bold text-xs text-slate-800 flex items-center gap-1.5 border-b border-slate-200/60 pb-2">
              <span className="w-1.5 h-3 bg-blue-600 rounded"></span>
              <span>核心信息登记</span>
            </div>

            <div className="grid grid-cols-2 gap-3.5 text-xs">
              <div>
                <span className="text-slate-400 font-medium">企业名称</span>
                <div className="font-bold text-slate-800 mt-0.5 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{record.enterpriseName}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-medium">联系对接时间</span>
                <div className="font-bold text-slate-800 mt-0.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-mono">{record.createTime}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-medium">联络方式</span>
                <div className="font-bold text-slate-800 mt-0.5">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    record.method === 'SDZF' 
                      ? 'bg-blue-50 text-blue-700 border border-blue-100' 
                      : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                  }`}>
                    {record.method === 'SDZF' ? '实地走访 (SDZF)' : '电话沟通 (DHGT)'}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-medium">责任归属 & 状态</span>
                <div className="font-bold text-slate-800 mt-0.5 flex items-center gap-1.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    isDraft 
                      ? 'bg-amber-50 text-amber-700 border border-amber-100' 
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                  }`}>
                    {isDraft ? '草稿暂存' : '已正式提交'}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    ({record.owner === 'OWN' ? '个人包保' : '辖区共有'})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Visit Summary Section */}
          <div className="space-y-2">
            <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-500" />
              <span>走访联络对接概况（摘要）</span>
            </h5>
            <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-700 leading-relaxed font-normal whitespace-pre-wrap">
              {record.latestSummary}
            </div>
          </div>

          {/* Collected Problems Section */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>现场收集的问题诉求 ({record.problems.length})</span>
              </span>
              <span className={`text-[10px] px-2 py-0.2 rounded font-bold ${
                record.activeProblemCount > 0 ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-slate-100 text-slate-500'
              }`}>
                未办结数：{record.activeProblemCount}
              </span>
            </h5>

            {record.problems.length === 0 ? (
              <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-400 italic">
                此次联络中没有收集到新的政企协调和办结问题诉求。
              </div>
            ) : (
              <div className="space-y-3">
                {record.problems.map((prob, index) => {
                  return (
                    <div 
                      key={prob.id || index}
                      className="p-3.5 border border-slate-200 rounded-xl bg-white space-y-2.5 shadow-sm"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium border border-slate-200">
                            {prob.category}
                          </span>
                        </div>
                        
                        {/* Status tag */}
                        <span className={`text-[9px] px-2 py-0.5 rounded font-extrabold ${
                          prob.status === '收集' ? 'bg-slate-100 text-slate-600 border border-slate-200' :
                          prob.status === '已转交' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                          prob.status === '办理中' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                          'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        }`}>
                          {prob.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-800 font-semibold leading-relaxed">
                        {prob.summary}
                      </p>

                      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>限办时间：{prob.dueDate}</span>
                        </span>
                        
                        {prob.status !== '已办结' ? (
                          <span className="text-rose-600 font-bold bg-rose-50 px-1.5 py-0.2 rounded border border-rose-100">
                            正在跟进中
                          </span>
                        ) : (
                          <span className="text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100">
                            已办结闭环
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer with actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 border border-slate-300 rounded-lg hover:bg-white transition-all cursor-pointer shadow-sm"
          >
            返回列表
          </button>

          {isDraft && onSubmitDraft && (
            <button 
              onClick={() => {
                onSubmitDraft(record.id);
                onClose();
              }}
              className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>提交此草稿档案为正式记录</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
