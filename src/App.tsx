import React, { useState, useEffect } from 'react';
import { 
  initialEnterprises, 
  initialProblems, 
  initialVisitRecords 
} from './data';
import { Enterprise, CollectedProblem, VisitRecord, ApiCallLog } from './types';

// Import subcomponents
import { DashboardView } from './components/DashboardView';
import { ReminderView } from './components/ReminderView';
import { RecordsView } from './components/RecordsView';
import { ApiConsoleView } from './components/ApiConsoleView';
import { DetailDrawer } from './components/DetailDrawer';
import { RecordModal } from './components/RecordModal';

// Icons
import { 
  LayoutDashboard, 
  Clock, 
  FolderSync, 
  Terminal, 
  CloudCheck, 
  Building2, 
  User, 
  Calendar, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Bell,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function App() {
  // 1. Navigation Tab State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'reminder' | 'records' | 'apis'>('dashboard');
  
  // 2. Global Core State with LocalStorage Persistence
  const [enterprises, setEnterprises] = useState<Enterprise[]>(() => {
    const saved = localStorage.getItem('gov_enterprises');
    return saved ? JSON.parse(saved) : initialEnterprises;
  });

  const [problems, setProblems] = useState<CollectedProblem[]>(() => {
    const saved = localStorage.getItem('gov_problems');
    return saved ? JSON.parse(saved) : initialProblems;
  });

  const [visitRecords, setVisitRecords] = useState<VisitRecord[]>(() => {
    const saved = localStorage.getItem('gov_records');
    return saved ? JSON.parse(saved) : initialVisitRecords;
  });

  const [apiLogs, setApiLogs] = useState<ApiCallLog[]>(() => {
    const saved = localStorage.getItem('gov_apilogs');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync state changes to LocalStorage
  useEffect(() => {
    localStorage.setItem('gov_enterprises', JSON.stringify(enterprises));
  }, [enterprises]);

  useEffect(() => {
    localStorage.setItem('gov_problems', JSON.stringify(problems));
  }, [problems]);

  useEffect(() => {
    localStorage.setItem('gov_records', JSON.stringify(visitRecords));
  }, [visitRecords]);

  useEffect(() => {
    localStorage.setItem('gov_apilogs', JSON.stringify(apiLogs));
  }, [apiLogs]);

  // 3. Coordination & Filter Parameter State (Cross-Tab Navigation)
  const [scope, setScope] = useState<'OWN' | 'ALL'>('OWN');
  const [searchFilterQuery, setSearchFilterQuery] = useState('');
  const [preSelectedRecordId, setPreSelectedRecordId] = useState('');

  // 4. Details Drawer State
  const [selectedRecord, setSelectedRecord] = useState<VisitRecord | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // 5. Creation Modal State
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<VisitRecord | null>(null);
  const [preFilledEnterpriseId, setPreFilledEnterpriseId] = useState('');

  // 6. UI Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Trigger automated drawer popup when navigated from Overdue list
  useEffect(() => {
    if (activeTab === 'records' && preSelectedRecordId) {
      const match = visitRecords.find(r => r.id === preSelectedRecordId);
      if (match) {
        setSelectedRecord(match);
        setIsDrawerOpen(true);
      }
      setPreSelectedRecordId(''); // Clear selection trigger
    }
  }, [activeTab, preSelectedRecordId, visitRecords]);

  // Show Toast Routine
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Cross-Tab handlers
  const handleSelectEnterpriseFromDashboard = (name: string) => {
    setSearchFilterQuery(name);
    setActiveTab('reminder');
  };

  const handleSelectProblemFromDashboard = (recordId: string) => {
    setPreSelectedRecordId(recordId);
    setActiveTab('records');
  };

  // Callback when creating contact for specific enterprise inside Reminder accordion
  const handleAddContactForEnterprise = (entId: string, entName: string) => {
    setPreFilledEnterpriseId(entId);
    setEditingRecord(null);
    setIsRecordModalOpen(true);
  };

  const handleAddGeneralContact = () => {
    setPreFilledEnterpriseId('');
    setEditingRecord(null);
    setIsRecordModalOpen(true);
  };

  // Save/Submit new/edited record
  const handleSaveRecord = (savedRecord: VisitRecord) => {
    const isNew = !visitRecords.some(r => r.id === savedRecord.id);

    // 1. Update visitRecords
    let updatedRecords: VisitRecord[];
    if (isNew) {
      updatedRecords = [savedRecord, ...visitRecords];
    } else {
      updatedRecords = visitRecords.map(r => r.id === savedRecord.id ? savedRecord : r);
    }
    setVisitRecords(updatedRecords);

    // 2. Synchronize and update problems master state
    // Delete any previous problems bound to this record
    let newProblems = problems.filter(p => !savedRecord.problems.some(sp => sp.id === p.id));
    
    // Append the newly edited/created problems
    if (savedRecord.problems.length > 0) {
      const matchedEnt = enterprises.find(e => e.id === savedRecord.enterpriseId);
      const appends: CollectedProblem[] = savedRecord.problems.map(p => ({
        id: p.id,
        summary: p.summary,
        enterpriseId: savedRecord.enterpriseId,
        enterpriseName: savedRecord.enterpriseName,
        category: p.category,
        status: p.status,
        dueDate: p.dueDate,
        overdueDays: 0,
        isOverdue: false,
        owner: matchedEnt?.owner || 'OWN'
      }));
      newProblems = [...appends, ...newProblems];
    }
    setProblems(newProblems);

    // 3. Update Enterprise visit counts & summaries reactively
    const updatedEnterprises = enterprises.map(ent => {
      if (ent.id === savedRecord.enterpriseId) {
        // Compute new visit count
        const entRecords = updatedRecords.filter(r => r.enterpriseId === ent.id && r.recordStatus === 1);
        return {
          ...ent,
          visitCount: entRecords.length,
          lastVisitDate: savedRecord.createTime,
          lastVisitSummary: savedRecord.latestSummary
        };
      }
      return ent;
    });
    setEnterprises(updatedEnterprises);

    // Log API response simulation automatically
    const logMsg: ApiCallLog = {
      timestamp: new Date().toLocaleTimeString(),
      url: `/mobile/biz/visit/submitVisitRecord`,
      method: 'POST',
      params: JSON.stringify(savedRecord, null, 2),
      response: JSON.stringify({ success: true, visitId: savedRecord.id, msg: "数据同步成功" }, null, 2)
    };
    setApiLogs([logMsg, ...apiLogs]);

    triggerToast(
      savedRecord.recordStatus === 1 
        ? `🎉 成功正式提交并上报对于【${savedRecord.enterpriseName}】的走访对接档案！` 
        : `💾 成功将【${savedRecord.enterpriseName}】的对接记录保存至本地草稿箱 (0)。`
    );
  };

  // Draft operations
  const handleEditDraft = (id: string) => {
    const match = visitRecords.find(r => r.id === id);
    if (match && match.recordStatus === 0) {
      setEditingRecord(match);
      setIsRecordModalOpen(true);
    }
  };

  const handleDeleteDraft = (id: string) => {
    const match = visitRecords.find(r => r.id === id);
    if (match && match.recordStatus === 0) {
      setVisitRecords(visitRecords.filter(r => r.id !== id));
      triggerToast(`🗑️ 已成功删除对于【${match.enterpriseName}】的暂存草稿！`);
    }
  };

  const handleSubmitDraftOfficially = (id: string) => {
    const updated = visitRecords.map(r => {
      if (r.id === id) {
        return { ...r, recordStatus: 1 as const };
      }
      return r;
    });
    setVisitRecords(updated);

    // Reactive update enterprise
    const matchedRecord = visitRecords.find(r => r.id === id);
    if (matchedRecord) {
      const entRecords = updated.filter(r => r.enterpriseId === matchedRecord.enterpriseId && r.recordStatus === 1);
      setEnterprises(enterprises.map(e => {
        if (e.id === matchedRecord.enterpriseId) {
          return {
            ...e,
            visitCount: entRecords.length,
            lastVisitDate: matchedRecord.createTime,
            lastVisitSummary: matchedRecord.latestSummary
          };
        }
        return e;
      }));
    }

    triggerToast(`🚀 成功将此草稿记录正式提交，进入市包保办常态跟踪流转！`);
  };

  // Trigger Detail view
  const handleViewDetails = (id: string) => {
    const match = visitRecords.find(r => r.id === id);
    if (match) {
      setSelectedRecord(match);
      setIsDrawerOpen(true);
    }
  };

  // Execute Simulated API from DevConsole
  const handleExecuteSimulatedApi = async (route: string, params: any) => {
    const logMsg: ApiCallLog = {
      timestamp: new Date().toLocaleTimeString(),
      url: route,
      method: route.includes('submit') ? 'POST' : 'GET',
      params: JSON.stringify(params, null, 2),
      response: `Status 200 OK - Simulating Response`
    };
    setApiLogs(prev => [logMsg, ...prev]);
    return { success: true };
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800">
      {/* 1. Left Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-white shrink-0 hidden lg:flex flex-col border-r border-slate-950">
        {/* Sidebar Header/Branding */}
        <div className="p-5 border-b border-slate-950 flex flex-col gap-2 bg-slate-950/40">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-500/25">
              <FolderSync className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-wider text-white uppercase">合肥政企包保直通车</h1>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">联系走访与问题闭环系统</span>
            </div>
          </div>
          
          {/* User Role Badge */}
          <div className="mt-2.5 p-2 bg-slate-850 rounded-lg border border-slate-800 flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <div className="min-w-0">
              <div className="text-[10px] text-slate-400 font-semibold leading-none">登录专员</div>
              <div className="text-[11px] font-bold text-slate-200 mt-1 truncate">包保工作组五组 (组长)</div>
            </div>
          </div>
        </div>

        {/* Tab Selection List */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3.5 mb-2">
            业务操作视窗
          </div>

          <button
            onClick={() => { setActiveTab('dashboard'); setSearchFilterQuery(''); }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="w-4.5 h-4.5" />
              <span>联系走访全景图</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          </button>

          <button
            onClick={() => setActiveTab('reminder')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'reminder'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Clock className="w-4.5 h-4.5" />
              <span>待联系企业提醒</span>
            </div>
            <span className="text-[9px] font-mono bg-blue-500/20 text-blue-300 font-extrabold px-1.5 py-0.2 rounded border border-blue-500/30">
              {enterprises.length}
            </span>
          </button>

          <button
            onClick={() => { setActiveTab('records'); setSearchFilterQuery(''); }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'records'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Building2 className="w-4.5 h-4.5" />
              <span>走访联系记录表</span>
            </div>
            <span className="text-[9px] font-mono bg-slate-800 text-slate-300 font-bold px-1.5 py-0.2 rounded border border-slate-700">
              {visitRecords.length}
            </span>
          </button>

          <div className="pt-4 pb-2">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3.5">
              接口与联调
            </div>
          </div>

          <button
            onClick={() => setActiveTab('apis')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'apis'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Terminal className="w-4.5 h-4.5" />
              <span>核心数据接口 (API)</span>
            </div>
            {apiLogs.length > 0 && (
              <span className="text-[9px] font-mono bg-emerald-500/20 text-emerald-400 font-extrabold px-1 rounded animate-pulse">
                {apiLogs.length}
              </span>
            )}
          </button>
        </nav>

        {/* Footer branding details */}
        <div className="p-4 border-t border-slate-950 text-[11px] text-slate-500 flex flex-col gap-1 bg-slate-950/20">
          <div className="flex items-center gap-1">
            <CloudCheck className="w-4 h-4 text-emerald-500" />
            <span>合肥市大数据包保中台</span>
          </div>
          <span className="font-mono text-[9px] text-slate-600">v1.2.4 (React 19 Prod)</span>
        </div>
      </aside>

      {/* 2. Main Work Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar Header */}
        <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-xs">
          {/* Left panel indicators */}
          <div className="flex items-center gap-3">
            <div className="lg:hidden p-1 bg-slate-900 rounded text-white mr-1">
              <FolderSync className="w-4.5 h-4.5" />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
                合肥高新区
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">|</span>
              <span className="text-xs font-medium text-slate-500 hidden sm:inline flex items-center gap-1 font-mono">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>系统标准时间：2026-06-26 (北京时间)</span>
              </span>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            {/* Quick API Synchronize button */}
            <button 
              onClick={() => triggerToast("🔄 已成功连接合肥市包保办公室统一平台，全辖区企业及诉求办结数据同步完毕！")}
              className="text-slate-500 hover:text-slate-800 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
              title="一键同步最新数据"
            >
              <RefreshCw className="w-4 h-4 text-blue-600" />
              <span className="hidden md:inline">同步上报中心</span>
            </button>

            {/* Cloud Connected Badge */}
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg border border-emerald-100 text-xs font-bold">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              <span>专网已联通</span>
            </div>
          </div>
        </header>

        {/* Dynamic Tab Content Area */}
        <main className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Mobile Nav Top tabs */}
            <div className="flex lg:hidden overflow-x-auto gap-1 border-b border-slate-200 pb-2 mb-2 scrollbar-thin">
              <button 
                onClick={() => { setActiveTab('dashboard'); setSearchFilterQuery(''); }}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
              >
                仪表盘
              </button>
              <button 
                onClick={() => setActiveTab('reminder')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap ${activeTab === 'reminder' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
              >
                待联系 ({enterprises.length})
              </button>
              <button 
                onClick={() => { setActiveTab('records'); setSearchFilterQuery(''); }}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap ${activeTab === 'records' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
              >
                走访记录 ({visitRecords.length})
              </button>
              <button 
                onClick={() => setActiveTab('apis')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap ${activeTab === 'apis' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
              >
                接口联调
              </button>
            </div>

            {/* Switch statement for Active view rendering */}
            {activeTab === 'dashboard' && (
              <DashboardView
                scope={scope}
                setScope={setScope}
                enterprises={enterprises}
                problems={problems}
                visitRecords={visitRecords}
                onSelectEnterprise={handleSelectEnterpriseFromDashboard}
                onSelectProblem={handleSelectProblemFromDashboard}
                onNavigateToTab={setActiveTab}
              />
            )}

            {activeTab === 'reminder' && (
              <ReminderView
                enterprises={enterprises}
                visitRecords={visitRecords}
                onAddContactForEnterprise={handleAddContactForEnterprise}
                onViewEnterpriseDetails={handleViewDetails}
                searchFilterQuery={searchFilterQuery}
              />
            )}

            {activeTab === 'records' && (
              <RecordsView
                visitRecords={visitRecords}
                onAddContact={handleAddGeneralContact}
                onEditDraft={handleEditDraft}
                onDeleteDraft={handleDeleteDraft}
                onViewDetails={handleViewDetails}
                onShowToast={triggerToast}
              />
            )}

            {activeTab === 'apis' && (
              <ApiConsoleView
                apiLogs={apiLogs}
                onClearLogs={() => setApiLogs([])}
                onExecuteSimulatedApi={handleExecuteSimulatedApi}
              />
            )}

          </div>
        </main>
      </div>

      {/* 3. Detail Drawer (Slide-over Right Panel) */}
      <DetailDrawer
        record={selectedRecord}
        isOpen={isDrawerOpen}
        onClose={() => { setSelectedRecord(null); setIsDrawerOpen(false); }}
        onSubmitDraft={handleSubmitDraftOfficially}
      />

      {/* 4. Form Creation / Edit Modal */}
      <RecordModal
        isOpen={isRecordModalOpen}
        onClose={() => { setIsRecordModalOpen(false); setEditingRecord(null); setPreFilledEnterpriseId(''); }}
        enterprises={enterprises}
        editingRecord={editingRecord}
        onSaveRecord={handleSaveRecord}
        preFilledEnterpriseId={preFilledEnterpriseId}
      />

      {/* 5. Custom Floating Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-scale-up max-w-md">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-xl p-4 shadow-2xl flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold leading-relaxed text-slate-100">{toastMessage}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
