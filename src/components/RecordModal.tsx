import React, { useState, useEffect } from 'react';
import { Enterprise, VisitRecord, CollectedProblem } from '../types';
import { 
  X, 
  Plus, 
  Trash2, 
  Calendar, 
  Phone, 
  Building2, 
  AlertTriangle, 
  CheckCircle2, 
  FileText 
} from 'lucide-react';

interface RecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  enterprises: Enterprise[];
  editingRecord: VisitRecord | null;
  onSaveRecord: (record: VisitRecord) => void;
  preFilledEnterpriseId?: string;
}

export const RecordModal: React.FC<RecordModalProps> = ({
  isOpen,
  onClose,
  enterprises,
  editingRecord,
  onSaveRecord,
  preFilledEnterpriseId = ''
}) => {
  if (!isOpen) return null;

  // Form State
  const [selectedEntId, setSelectedEntId] = useState('');
  const [createTime, setCreateTime] = useState('2026-06-26');
  const [method, setMethod] = useState<'SDZF' | 'DHGT'>('SDZF');
  const [latestSummary, setLatestSummary] = useState('');
  
  // Problems state subform
  const [problems, setProblems] = useState<{
    id: string;
    summary: string;
    category: CollectedProblem['category'];
    status: CollectedProblem['status'];
    dueDate: string;
  }[]>([]);

  // Temp state for single problem builder
  const [tempSummary, setTempSummary] = useState('');
  const [tempCategory, setTempCategory] = useState<CollectedProblem['category']>('惠企政策类');
  const [tempDueDate, setTempDueDate] = useState('2026-07-15');

  // Load editing record or prefilled enterprise info
  useEffect(() => {
    if (editingRecord) {
      setSelectedEntId(editingRecord.enterpriseId);
      setCreateTime(editingRecord.createTime);
      setMethod(editingRecord.method);
      setLatestSummary(editingRecord.latestSummary);
      setProblems(editingRecord.problems.map(p => ({
        id: p.id || 'prob-' + Math.random(),
        summary: p.summary,
        category: p.category,
        status: p.status,
        dueDate: p.dueDate
      })));
    } else {
      // Clear form
      setSelectedEntId(preFilledEnterpriseId || (enterprises.length > 0 ? enterprises[0].id : ''));
      setCreateTime('2026-06-26');
      setMethod('SDZF');
      setLatestSummary('');
      setProblems([]);
    }
  }, [editingRecord, preFilledEnterpriseId, enterprises, isOpen]);

  const categories: CollectedProblem['category'][] = [
    '惠企政策类', '融资贷款类', '人才需求类', '基础设施类', '证照办理类', '市场经营类', '其他类'
  ];

  // Add problem to list
  const handleAddProblemToDraft = () => {
    if (!tempSummary.trim()) return;
    setProblems([...problems, {
      id: 'prob-' + Date.now(),
      summary: tempSummary,
      category: tempCategory,
      status: '收集',
      dueDate: tempDueDate
    }]);
    setTempSummary('');
  };

  // Remove problem
  const handleRemoveProblemFromDraft = (index: number) => {
    setProblems(problems.filter((_, idx) => idx !== index));
  };

  // Save submit trigger
  const handleSubmit = (status: 0 | 1) => {
    if (!selectedEntId) return;

    const matchedEnt = enterprises.find(e => e.id === selectedEntId);
    if (!matchedEnt) return;

    const recordPayload: VisitRecord = {
      id: editingRecord ? editingRecord.id : 'rec-' + Date.now(),
      enterpriseId: selectedEntId,
      enterpriseName: matchedEnt.name,
      createTime,
      method,
      recordStatus: status,
      problemCount: problems.length,
      activeProblemCount: problems.filter(p => p.status !== '已办结').length,
      latestSummary: latestSummary || '未填写具体走访要点。',
      problems: problems,
      owner: editingRecord ? editingRecord.owner : 'OWN'
    };

    onSaveRecord(recordPayload);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white border border-slate-300 w-full max-w-xl rounded-xl shadow-2xl overflow-hidden animate-scale-up flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex justify-between items-center shrink-0">
          <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-blue-600" />
            <span>{editingRecord ? '编辑走访联系草稿记录' : '新增包保走访联系对接'}</span>
          </h4>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1 scrollbar-thin">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Enterprise Selector */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">对接责任企业</label>
              <select
                value={selectedEntId}
                onChange={(e) => setSelectedEntId(e.target.value)}
                disabled={!!editingRecord}
                className="w-full text-xs border border-slate-300 bg-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500 font-semibold"
              >
                <option value="">请选择挂载包保责任的企业...</option>
                {enterprises.map(ent => (
                  <option key={ent.id} value={ent.id}>
                    {ent.name} ({ent.level})
                  </option>
                ))}
              </select>
            </div>

            {/* Contact Date */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">联系日期</label>
              <div className="relative">
                <Calendar className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                <input 
                  type="date" 
                  value={createTime}
                  onChange={(e) => setCreateTime(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-blue-500 text-slate-700 font-mono"
                  required
                />
              </div>
            </div>
          </div>

          {/* Contact Method */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">对接联络形式</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer font-medium">
                <input 
                  type="radio" 
                  name="method" 
                  checked={method === 'SDZF'}
                  onChange={() => setMethod('SDZF')}
                  className="cursor-pointer"
                />
                <span>实地走访 (SDZF)</span>
              </label>

              <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer font-medium">
                <input 
                  type="radio" 
                  name="method" 
                  checked={method === 'DHGT'}
                  onChange={() => setMethod('DHGT')}
                  className="cursor-pointer"
                />
                <span>电话沟通 (DHGT)</span>
              </label>
            </div>
          </div>

          {/* Summary Textarea */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">走访对接概况摘要（企业沟通重点与运营实情）</label>
            <textarea 
              value={latestSummary}
              onChange={(e) => setLatestSummary(e.target.value)}
              placeholder="请输入企业当前运营状况、近期主攻项目进展以及对接中企业口头反馈的相关情况..."
              className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 resize-none h-20 leading-relaxed"
              required
            />
          </div>

          {/* PROBLEMS SUBFORM DYNAMIC */}
          <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/70 space-y-3.5">
            <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5 border-b border-slate-200 pb-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>本轮走访现场收集问题诉求子单表 (当前已收集：{problems.length}个)</span>
            </div>

            {/* List of current added problems */}
            {problems.length > 0 && (
              <div className="space-y-2 max-h-36 overflow-y-auto">
                {problems.map((p, idx) => (
                  <div key={idx} className="flex items-start justify-between gap-3 bg-white border border-slate-150 p-2 rounded-lg">
                    <div className="text-xs flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[9px] bg-blue-50 text-blue-700 px-1 py-0.2 rounded font-bold border border-blue-100">{p.category}</span>
                        <span className="text-[10px] text-slate-400 font-mono">限办：{p.dueDate}</span>
                      </div>
                      <p className="text-slate-700 mt-1 font-semibold leading-tight">{p.summary}</p>
                    </div>
                    
                    <button 
                      type="button" 
                      onClick={() => handleRemoveProblemFromDraft(idx)}
                      className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Problem builder controls */}
            <div className="bg-white p-3 border border-slate-200 rounded-xl space-y-3 shadow-inner">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Category selector */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">诉求问题大类</label>
                  <select 
                    value={tempCategory}
                    onChange={(e) => setTempCategory(e.target.value as CollectedProblem['category'])}
                    className="w-full text-xs border border-slate-300 bg-white rounded-lg px-2 py-1.5 focus:outline-none"
                  >
                    {categories.map((c, idx) => (
                      <option key={idx} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">限办截止时限</label>
                  <input 
                    type="date" 
                    value={tempDueDate}
                    onChange={(e) => setTempDueDate(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg px-2 py-1 focus:outline-none font-mono text-slate-700"
                  />
                </div>
              </div>

              {/* Problem summary */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">收集问题诉求具体摘要</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={tempSummary}
                    onChange={(e) => setTempSummary(e.target.value)}
                    placeholder="输入该企业反映的融资、用工、证照审批、土地、用能等具体问题摘要..."
                    className="flex-1 text-xs border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddProblemToDraft}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg shadow shrink-0 flex items-center gap-1 cursor-pointer active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>追加到列表</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer controls */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 border border-slate-300 rounded-lg hover:bg-white transition-all cursor-pointer shadow-sm"
          >
            取消
          </button>

          <div className="flex gap-2">
            {/* Save as Draft */}
            <button 
              type="button" 
              onClick={() => handleSubmit(0)}
              className="px-4 py-2 text-xs font-semibold bg-amber-500 text-white hover:bg-amber-600 rounded-lg shadow-md active:scale-95 transition-all cursor-pointer"
            >
              暂存为草稿 (0)
            </button>

            {/* Submit officially */}
            <button 
              type="button" 
              onClick={() => handleSubmit(1)}
              className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>正式上报提交 (1)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
