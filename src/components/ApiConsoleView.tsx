import React, { useState, useEffect } from 'react';
import { ApiCallLog } from '../types';
import { 
  Send, 
  Terminal, 
  Globe, 
  FileCode, 
  RefreshCw,
  Search,
  CheckCircle2
} from 'lucide-react';

interface ApiConsoleViewProps {
  apiLogs: ApiCallLog[];
  onClearLogs: () => void;
  onExecuteSimulatedApi: (route: string, params: any) => Promise<any>;
}

interface MockRouteSpec {
  method: 'GET' | 'POST';
  path: string;
  desc: string;
  requestBody: string;
  responseBody: string;
}

export const ApiConsoleView: React.FC<ApiConsoleViewProps> = ({
  apiLogs,
  onClearLogs,
  onExecuteSimulatedApi
}) => {
  // 1. Static API routes defined in specification
  const routeSpecs: MockRouteSpec[] = [
    {
      method: 'GET',
      path: '/biz/visit/getDashboardData',
      desc: '获取首页走访仪表盘汇总数据，包含各指标和图表分类比例。',
      requestBody: '{\n  "scope": "OWN" // OWN=个人包保, ALL=全市数据\n}',
      responseBody: '{\n  "totalContacts": 15,\n  "contactedEnterprises": 5,\n  "collectedProblems": 12,\n  "resolvedProblems": 9,\n  "problemResolutionRate": 75.0,\n  "statusDistribution": {\n    "collected": 2,\n    "assigned": 3,\n    "processing": 1,\n    "resolved": 6\n  }\n}'
    },
    {
      method: 'GET',
      path: '/biz/visit/getHomeVisitStats',
      desc: '拉取走访对接四项指标汇总数据。',
      requestBody: '{\n  "scope": "ALL"\n}',
      responseBody: '{\n  "totalVisitCount": 186,\n  "contactedCount": 84,\n  "associatedCount": 120,\n  "collectedCount": 92,\n  "overdueCount": 14,\n  "resolvedCount": 78,\n  "completionRate": 84.7\n}'
    },
    {
      method: 'GET',
      path: '/biz/visit/getOverdueUnvisitedEnterprises',
      desc: '拉取本月逾期或即将超期未联系的挂钩包保企业预警名单。',
      requestBody: '{\n  "page": 1,\n  "limit": 10\n}',
      responseBody: '{\n  "total": 2,\n  "list": [\n    {\n      "enterpriseId": "ent-4",\n      "enterpriseName": "安徽国轩高科动力能源有限公司",\n      "level": "一类",\n      "dueDate": "2026-06-28",\n      "daysLeft": 2,\n      "visitCount": 1\n    }\n  ]\n}'
    },
    {
      method: 'GET',
      path: '/biz/visit/getLatestVisits',
      desc: '拉取最新 5 条政企走访、电话对接记录概览。',
      requestBody: '{}',
      responseBody: '[\n  { "id": "rec-1", "enterpriseName": "合肥科大讯飞股份有限公司", "createTime": "2026-06-25", "method": "SDZF" },\n  { "id": "rec-2", "enterpriseName": "合肥阳光电源股份有限公司", "createTime": "2026-06-24", "method": "DHGT" }\n]'
    },
    {
      method: 'GET',
      path: '/qyzf/biz/visit/getAssociatedEnterprises',
      desc: '拉取辖区内或个人名下的挂载关联企业名录。',
      requestBody: '{\n  "scope": "OWN"\n}',
      responseBody: '{\n  "total": 5,\n  "enterprises": [\n    { "id": "ent-1", "name": "合肥科大讯飞股份有限公司", "level": "一类", "responsibleUnit": "市科技局" }\n  ]\n}'
    },
    {
      method: 'POST',
      path: '/mobile/biz/visit/submitVisitRecord',
      desc: '提交包保走访对接记录，提交后状态将转为正式记录且锁定不能删除。',
      requestBody: '{\n  "enterpriseId": "ent-1",\n  "method": "SDZF",\n  "summary": "实地现场沟通了新厂房环保审核进度...",\n  "problems": [\n    {\n      "summary": "高压电线迁改面临资金缺口",\n      "category": "融资贷款类",\n      "dueDate": "2026-07-10"\n    }\n  ]\n}',
      responseBody: '{\n  "success": true,\n  "visitId": "rec-new-8899",\n  "msg": "走访对接记录正式提交上报成功！"\n}'
    }
  ];

  const [selectedRouteIdx, setSelectedRouteIdx] = useState(0);
  const [requestPayload, setRequestPayload] = useState('');
  const [responseOutput, setResponseOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

  // Update editor values when selected api changes
  useEffect(() => {
    const route = routeSpecs[selectedRouteIdx];
    if (route) {
      setRequestPayload(route.requestBody);
      setResponseOutput('');
      setTerminalLogs([]);
    }
  }, [selectedRouteIdx]);

  // Execute API Request
  const handleExecute = () => {
    setIsExecuting(true);
    const activeRoute = routeSpecs[selectedRouteIdx];
    
    setTerminalLogs([
      `[${new Date().toLocaleTimeString()}] HTTP Request: ${activeRoute.method} http://gov.hefei.biz/api${activeRoute.path}`,
      `[${new Date().toLocaleTimeString()}] Content-Type: application/json`,
      `[${new Date().toLocaleTimeString()}] Body: ${requestPayload}`,
      `[${new Date().toLocaleTimeString()}] Connecting to server backend cluster...`,
    ]);

    setTimeout(() => {
      setTerminalLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Intercepting authentication token context...`,
        `[${new Date().toLocaleTimeString()}] Database query successful (Prisma PostgreSQL execution 4ms)`,
        `[${new Date().toLocaleTimeString()}] Received Server response: Status 200 OK`
      ]);

      // Call our simulation hook to write dynamic updates if needed
      let parsed = {};
      try {
        parsed = JSON.parse(requestPayload);
      } catch(e) {}
      
      onExecuteSimulatedApi(activeRoute.path, parsed);

      setResponseOutput(activeRoute.responseBody);
      setIsExecuting(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
        <div>
          <h3 className="text-base font-bold text-slate-800">政企服务平台核心数据接口 (API)</h3>
          <p className="text-xs text-slate-500 mt-1">此控制面板集成了系统的 API 规范及调试工具，可模拟手机端、网页端与服务器交互过程。</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left endpoint spec indices */}
        <div className="lg:col-span-5 space-y-3.5">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200/60 font-bold text-xs text-slate-800 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-blue-500" />
              <span>数据接口索引规范 ({routeSpecs.length})</span>
            </div>

            <div className="divide-y divide-slate-100 max-h-[450px] overflow-y-auto">
              {routeSpecs.map((spec, index) => (
                <div 
                  key={index}
                  onClick={() => setSelectedRouteIdx(index)}
                  className={`p-3.5 cursor-pointer transition-colors flex items-start gap-3 relative ${
                    selectedRouteIdx === index ? 'bg-blue-50/60' : 'hover:bg-slate-50/50'
                  }`}
                >
                  <span className={`text-[9px] font-mono font-extrabold px-1.5 py-0.5 rounded w-14 text-center shrink-0 ${
                    spec.method === 'POST' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-blue-100 text-blue-800 border border-blue-200'
                  }`}>
                    {spec.method}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-mono font-bold text-slate-800 truncate">{spec.path}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5 truncate leading-relaxed">{spec.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right sandbox console */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
          {(() => {
            const spec = routeSpecs[selectedRouteIdx];
            if (!spec) return null;

            return (
              <>
                {/* Sandbox Header */}
                <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-mono font-bold text-slate-300">数据接口沙盒模拟器</span>
                  </div>

                  <button
                    onClick={handleExecute}
                    disabled={isExecuting}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer active:scale-95 shadow"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isExecuting ? '连接传输中...' : '发送请求测试'}</span>
                  </button>
                </div>

                {/* Body parameters workspace */}
                <div className="p-4 bg-slate-950 font-mono text-xs text-slate-300 space-y-4 flex-1">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">接口规范地址 & 功能</div>
                    <div className="bg-slate-900 border border-slate-850 p-2 rounded-lg flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                          spec.method === 'POST' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                        }`}>{spec.method}</span>
                        <span className="text-white text-xs font-bold">http://gov.hefei.biz/api{spec.path}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-0.5 font-sans">{spec.desc}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* JSON Payload input */}
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">JSON 请求载荷 (RequestBody)</div>
                      <textarea
                        value={requestPayload}
                        onChange={(e) => setRequestPayload(e.target.value)}
                        rows={7}
                        className="w-full bg-slate-900 border border-slate-850 rounded-lg p-2.5 text-[11px] text-emerald-400 focus:outline-none focus:border-slate-750 font-mono resize-none leading-relaxed"
                      />
                    </div>

                    {/* Server logs */}
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">模拟服务器响应日志 (Server Log)</div>
                      <div className="w-full bg-slate-900 border border-slate-850 rounded-lg p-2.5 text-[10px] text-slate-400 h-[155px] overflow-y-auto space-y-1.5 scrollbar-thin">
                        {terminalLogs.length === 0 ? (
                          <div className="text-slate-600 italic">请点击右上角【发送请求测试】查看实时日志通讯流...</div>
                        ) : (
                          terminalLogs.map((log, idx) => (
                            <div key={idx} className="leading-normal">{log}</div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Server response JSON */}
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">服务器响应正文 (ResponseBody JSON)</div>
                    <pre className="w-full bg-slate-900 border border-slate-850 rounded-lg p-3 text-[11px] text-blue-300 h-36 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                      {responseOutput || '// 发送请求测试来查看经过服务器端安全中间件处理后的返回报文'}
                    </pre>
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
};
