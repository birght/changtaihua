import React, { useState } from 'react';
import { VisitRecord } from '../types';
import { 
  Search, 
  Plus, 
  Download, 
  Trash2, 
  Edit3, 
  FileText, 
  Phone, 
  Building2, 
  RefreshCw, 
  Calendar,
  Layers,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

interface RecordsViewProps {
  visitRecords: VisitRecord[];
  onAddContact: () => void;
  onEditDraft: (id: string) => void;
  onDeleteDraft: (id: string) => void;
  onViewDetails: (id: string) => void;
  onShowToast: (msg: string) => void;
}

export const RecordsView: React.FC<RecordsViewProps> = ({
  visitRecords,
  onAddContact,
  onEditDraft,
  onDeleteDraft,
  onViewDetails,
  onShowToast
}) => {
  // Search state variables
  const [searchEnt, setSearchEnt] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [searchMethod, setSearchMethod] = useState<string>('全部');
  const [searchStatus, setSearchStatus] = useState<string>('全部');
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());

  // Filter records
  const filteredRecords = visitRecords.filter(rec => {
    const matchesEnt = rec.enterpriseName.toLowerCase().includes(searchEnt.toLowerCase());
    const matchesDate = !searchDate || rec.createTime === searchDate;
    
    let matchesMethod = true;
    if (searchMethod === 'SDZF') matchesMethod = rec.method === 'SDZF';
    if (searchMethod === 'DHGT') matchesMethod = rec.method === 'DHGT';

    let matchesStatus = true;
    if (searchStatus === '0') matchesStatus = rec.recordStatus === 0;
    if (searchStatus === '1') matchesStatus = rec.recordStatus === 1;

    return matchesEnt && matchesDate && matchesMethod && matchesStatus;
  });

  // Reset filters
  const handleResetFilters = () => {
    setSearchEnt('');
    setSearchDate('');
    setSearchMethod('全部');
    setSearchStatus('全部');
    setSelectedRowIds(new Set());
  };

  // Toggle selection of a single row
  const toggleRowSelection = (id: string) => {
    const newSelection = new Set(selectedRowIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedRowIds(newSelection);
  };

  // Toggle selection of all rows
  const toggleAllRows = () => {
    if (selectedRowIds.size === filteredRecords.length) {
      setSelectedRowIds(new Set());
    } else {
      setSelectedRowIds(new Set(filteredRecords.map(r => r.id)));
    }
  };

  // Export records
  const handleExport = () => {
    if (selectedRowIds.size === 0) {
      // Export all matches
      onShowToast(`成功按当前筛选条件导出 ${filteredRecords.length} 条走访数据为 Excel 表格！`);
    } else {
      onShowToast(`成功导出选中的 ${selectedRowIds.size} 条包保走访记录明细！`);
    }
  };

  return (
    <div className="space-y-6">
      {/* 搜索与检索表单栏 */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
        <div className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5 border-b border-slate-100 pb-2">
          <Building2 className="w-4 h-4 text-blue-600" />
          <span>多维检索过滤</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Condition 1: Enterprise Name */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">企业名称</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input 
                type="text" 
                value={searchEnt}
                onChange={(e) => setSearchEnt(e.target.value)}
                placeholder="输入企业名称关键字..."
                className="w-full text-xs border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Condition 2: Contact Date */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">联系日期</label>
            <div className="relative">
              <Calendar className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input 
                type="date" 
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-blue-500 text-slate-700"
              />
            </div>
          </div>

          {/* Condition 3: Method */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">联系方式</label>
            <select
              value={searchMethod}
              onChange={(e) => setSearchMethod(e.target.value)}
              className="w-full bg-white text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-blue-500"
            >
              <option value="全部">全部方式</option>
              <option value="SDZF">实地联系 (SDZF)</option>
              <option value="DHGT">电话沟通 (DHGT)</option>
            </select>
          </div>

          {/* Condition 4: Status */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">记录状态</label>
            <select
              value={searchStatus}
              onChange={(e) => setSearchStatus(e.target.value)}
              className="w-full bg-white text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-blue-500"
            >
              <option value="全部">全部状态</option>
              <option value="0">草稿 (0)</option>
              <option value="1">已提交 (1)</option>
            </select>
          </div>
        </div>

        {/* Action Buttons inside filter panel */}
        <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>重置检索</span>
          </button>
        </div>
      </div>

      {/* 记录主卡片及表格 */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {/* Top bar inside the main grid */}
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200/60 flex flex-col sm:flex-row gap-3 justify-between sm:items-center">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-5 bg-blue-600 rounded"></span>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              走访联络对接档案列表
            </h4>
            <span className="text-[10px] bg-slate-200 text-slate-600 font-bold px-2 py-0.5 rounded-full font-mono">
              已检索 {filteredRecords.length} 项
            </span>
          </div>

          {/* Core actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-all cursor-pointer"
              title="支持选择多行导出，或者根据检索条件整体导出"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{selectedRowIds.size > 0 ? `导出选中 (${selectedRowIds.size})` : '按条件导出 Excel'}</span>
            </button>
            
            <button
              onClick={onAddContact}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>新增走访记录</span>
            </button>
          </div>
        </div>

        {/* Table layout */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 bg-slate-50 border-b border-slate-150 uppercase text-[10px] tracking-wider select-none">
                <th className="px-4 py-3 text-center w-10">
                  <input 
                    type="checkbox" 
                    checked={filteredRecords.length > 0 && selectedRowIds.size === filteredRecords.length}
                    onChange={toggleAllRows}
                    className="cursor-pointer"
                  />
                </th>
                <th className="px-3 py-3 text-center w-12 font-bold">序号</th>
                <th className="px-4 py-3 font-bold">企业名称</th>
                <th className="px-4 py-3 font-bold">联系日期</th>
                <th className="px-4 py-3 font-bold">联系方式</th>
                <th className="px-4 py-3 font-bold">记录状态</th>
                <th className="px-4 py-3 font-bold text-center">收集问题数</th>
                <th className="px-4 py-3 font-bold text-center">未解决问题</th>
                <th className="px-4 py-3 font-bold max-w-xs">走访概况</th>
                <th className="px-4 py-3 text-right font-bold pr-5 w-40">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-slate-400 italic">
                    没有找到符合检索条件的联系记录。
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec, idx) => {
                  const isSelected = selectedRowIds.has(rec.id);
                  const isDraft = rec.recordStatus === 0;
                  const hasActiveProblems = rec.activeProblemCount > 0;
                  
                  return (
                    <tr 
                      key={rec.id}
                      className={`hover:bg-slate-50/50 transition-colors ${isSelected ? 'bg-blue-50/20' : ''}`}
                    >
                      {/* Checkbox selection */}
                      <td className="px-4 py-3 text-center">
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          onChange={() => toggleRowSelection(rec.id)}
                          className="cursor-pointer"
                        />
                      </td>

                      {/* No. (computed dynamically per filter) */}
                      <td className="px-3 py-3 text-center font-mono text-slate-500 font-medium">
                        {idx + 1}
                      </td>

                      {/* Enterprise Name */}
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{rec.enterpriseName}</div>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3 font-mono text-slate-600">
                        {rec.createTime}
                      </td>

                      {/* Method (SDZF/DHGT) */}
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          rec.method === 'SDZF' 
                            ? 'bg-blue-50 text-blue-700 border border-blue-100' 
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                        }`}>
                          {rec.method === 'SDZF' ? '实地联系 (SDZF)' : '电话沟通 (DHGT)'}
                        </span>
                      </td>

                      {/* Record Status (Draft/Submitted) */}
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 w-max ${
                          isDraft 
                            ? 'bg-amber-50 text-amber-700 border border-amber-100' 
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isDraft ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                          <span>{isDraft ? '草稿' : '已提交'}</span>
                        </span>
                      </td>

                      {/* Total Problem Count */}
                      <td className="px-4 py-3 text-center font-mono font-medium text-slate-600 text-sm">
                        {rec.problemCount}
                      </td>

                      {/* Active Problem Count */}
                      <td className="px-4 py-3 text-center">
                        <span className={`font-mono font-extrabold text-sm px-1.5 py-0.5 rounded ${
                          hasActiveProblems 
                            ? 'bg-rose-50 text-rose-600 border border-rose-100 font-extrabold' 
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          {rec.activeProblemCount}
                        </span>
                      </td>

                      {/* Summary text */}
                      <td className="px-4 py-3 text-slate-500 max-w-xs truncate" title={rec.latestSummary}>
                        {rec.latestSummary}
                      </td>

                      {/* Interactive Row Operations */}
                      <td className="px-4 py-3 text-right pr-5 whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Detail (All) */}
                          <button 
                            onClick={() => onViewDetails(rec.id)}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1.5 rounded transition-all flex items-center gap-0.5 font-semibold cursor-pointer text-[11px]"
                            title="查阅详细对接、部门流转和处理问题全过程"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>详情</span>
                          </button>

                          {/* Edit (Draft only) */}
                          {isDraft && (
                            <button 
                              onClick={() => onEditDraft(rec.id)}
                              className="text-amber-600 hover:text-amber-800 hover:bg-amber-50 p-1.5 rounded transition-all flex items-center gap-0.5 font-semibold cursor-pointer text-[11px]"
                              title="编辑草稿"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>编辑</span>
                            </button>
                          )}

                          {/* Delete (Draft only) */}
                          {isDraft && (
                            <button 
                              onClick={() => onDeleteDraft(rec.id)}
                              className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1.5 rounded transition-all cursor-pointer"
                              title="删除草稿"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
