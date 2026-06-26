import { Enterprise, VisitRecord, CollectedProblem } from './types';

// 1. 默认关联企业数据列表
export const initialEnterprises: Enterprise[] = [
  {
    id: "ent-1",
    name: "合肥科大讯飞股份有限公司",
    industry: "人工智能",
    industryCategory: "软件和信息技术服务业",
    scale: "大型企业",
    contactPerson: "刘明",
    contactPhone: "13855110022",
    address: "合肥市高新区望江西路666号",
    responsibleUnit: "市科技局",
    provinceLeader: "张建国（副省长）",
    cityLeader: "李伟（副市长）",
    level: "一类",
    dueDate: "2026-07-02",
    daysLeft: 6,
    visitCount: 4,
    lastVisitDate: "2026-06-01",
    lastVisitSummary: "就大模型计算资源申请与支持资金落地进行细节探讨，企业反馈人才引进需政策补贴倾斜。",
    owner: "OWN"
  },
  {
    id: "ent-2",
    name: "安徽江汽集团股份有限公司",
    industry: "汽车制造",
    industryCategory: "高端装备制造业",
    scale: "大型企业",
    contactPerson: "王志刚",
    contactPhone: "13905513344",
    address: "合肥市包河区东流路97号",
    responsibleUnit: "市经信局",
    provinceLeader: "刘宏伟（省委常委）",
    cityLeader: "王海涛（副市长）",
    level: "一类",
    dueDate: "2026-07-15",
    daysLeft: 19,
    visitCount: 3,
    lastVisitDate: "2026-06-10",
    lastVisitSummary: "现场考察新能源轻卡总装车间，收集了配套供应链企业融资贵及园区道路限行的诉求。",
    owner: "OWN"
  },
  {
    id: "ent-3",
    name: "合肥阳光电源股份有限公司",
    industry: "光伏与储能",
    industryCategory: "新能源及节能环保产业",
    scale: "中型企业",
    contactPerson: "徐波",
    contactPhone: "13605518899",
    address: "合肥市高新区习友路1699号",
    responsibleUnit: "高新区管委会",
    provinceLeader: "王副省长",
    cityLeader: "赵副市长",
    level: "二类",
    dueDate: "2026-07-20",
    daysLeft: 24,
    visitCount: 2,
    lastVisitDate: "2026-06-24",
    lastVisitSummary: "对屋顶光伏并网指标申请进度进行跟踪，协调市供电窗口办理相关手续。",
    owner: "OWN"
  },
  {
    id: "ent-4",
    name: "安徽国轩高科动力能源有限公司",
    industry: "锂离子电池",
    industryCategory: "新能源及汽车零部件",
    scale: "大型企业",
    contactPerson: "陈建",
    contactPhone: "18955167788",
    address: "合肥市新站区岱河路115号",
    responsibleUnit: "新站高新区经贸局",
    provinceLeader: "李瑞丰（副省长）",
    cityLeader: "陈晓东（新站区管委会主任）",
    level: "一类",
    dueDate: "2026-06-28",
    daysLeft: 2,
    visitCount: 1,
    lastVisitDate: "2026-06-18",
    lastVisitSummary: "现场调研企业三期厂房建设，反馈环评手续批复周期较长，会同环保部门现场解答指导。",
    owner: "ALL" // 属于他人包保
  },
  {
    id: "ent-5",
    name: "合肥本源量子计算科技有限责任公司",
    industry: "量子科技",
    industryCategory: "下一代信息技术产业",
    scale: "小型企业",
    contactPerson: "孙东林",
    contactPhone: "18055154321",
    address: "合肥市高新区创新大道111号",
    responsibleUnit: "市发改委",
    provinceLeader: "无",
    cityLeader: "孙局长（市发改委主任）",
    level: "三类",
    dueDate: "2026-07-28",
    daysLeft: 32,
    visitCount: 5,
    lastVisitDate: "2026-06-15",
    lastVisitSummary: "就最新的研发费用加计扣除细则申报进行了专题辅导，企业表示收获很大。",
    owner: "OWN"
  },
  {
    id: "ent-6",
    name: "安徽芯瑞达科技股份有限公司",
    industry: "新型显示",
    industryCategory: "电子信息及显示器产业",
    scale: "中型企业",
    contactPerson: "周总",
    contactPhone: "13511223344",
    address: "合肥市新站区铜陵北路与珠江路交口",
    responsibleUnit: "新站区经贸局",
    provinceLeader: "无",
    cityLeader: "钱主任",
    level: "三类",
    dueDate: "2026-07-04",
    daysLeft: 8,
    visitCount: 0,
    lastVisitDate: "暂无",
    lastVisitSummary: "本月尚未开展联系对接，系统提醒需要尽快安排对接走访。",
    owner: "ALL" // 属于他人包保
  },
  {
    id: "ent-7",
    name: "合肥维信诺科技有限公司",
    industry: "柔性显示屏",
    industryCategory: "新型显示产业",
    scale: "大型企业",
    contactPerson: "赵经理",
    contactPhone: "13799887766",
    address: "合肥市新站区新蚌埠路与魏武路交口",
    responsibleUnit: "新站高新区管委会",
    provinceLeader: "高省长",
    cityLeader: "宋市长",
    level: "二类",
    dueDate: "2026-07-12",
    daysLeft: 16,
    visitCount: 1,
    lastVisitDate: "2026-05-12",
    lastVisitSummary: "对接了关于设备进口通关效率的政策诉求，海关部门已进行线上答复与绿色通道支持。",
    owner: "ALL"
  }
];

// 2. 默认问题收集数据列表
export const initialProblems: CollectedProblem[] = [
  {
    id: "prob-1",
    summary: "新大楼新引进青年博士未能及时享受到高新区一次性租房及生活补贴。",
    enterpriseName: "合肥科大讯飞股份有限公司",
    enterpriseId: "ent-1",
    category: "人才需求类",
    status: "已转交",
    dueDate: "2026-06-22",
    overdueDays: 4,
    isOverdue: true,
    owner: "OWN"
  },
  {
    id: "prob-2",
    summary: "新园区二期并网高压线杆迁移迟缓，面临 2000 万元流动资金缺口希望协调低息贷款支持。",
    enterpriseName: "合肥阳光电源股份有限公司",
    enterpriseId: "ent-3",
    category: "融资贷款类",
    status: "办理中",
    dueDate: "2026-06-14",
    overdueDays: 12,
    isOverdue: true,
    owner: "OWN"
  },
  {
    id: "prob-3",
    summary: "园区西侧支路在上下班高峰重载物流车限行，导致出货效率低下，盼调整限行时段。",
    enterpriseName: "安徽江汽集团股份有限公司",
    enterpriseId: "ent-2",
    category: "基础设施类",
    status: "已办结",
    dueDate: "2026-06-10",
    overdueDays: 0,
    isOverdue: false,
    owner: "OWN"
  },
  {
    id: "prob-4",
    summary: "三期锂离子电池包组装项目环评已经上报，盼协调环保局加快会审审批公示速度。",
    enterpriseName: "安徽国轩高科动力能源有限公司",
    enterpriseId: "ent-4",
    category: "证照办理类",
    status: "收集",
    dueDate: "2026-06-18",
    overdueDays: 8,
    isOverdue: true,
    owner: "ALL"
  },
  {
    id: "prob-5",
    summary: "关于研发费用加计扣除‘免申即享’新政如何在线申报抵扣，财务人员仍需要针对性指导。",
    enterpriseName: "合肥本源量子计算科技有限责任公司",
    enterpriseId: "ent-5",
    category: "惠企政策类",
    status: "已办结",
    dueDate: "2026-06-15",
    overdueDays: 0,
    isOverdue: false,
    owner: "OWN"
  }
];

// 3. 默认联系走访记录列表
export const initialVisitRecords: VisitRecord[] = [
  {
    id: "rec-1",
    enterpriseId: "ent-1",
    enterpriseName: "合肥科大讯飞股份有限公司",
    createTime: "2026-06-25",
    method: "SDZF",
    recordStatus: 1, // 已提交
    problemCount: 1,
    activeProblemCount: 1,
    latestSummary: "前往讯飞人工智能大厦进行现场调研，面对面听取了企业关于大模型算力补贴申报和新进博士人才房租补贴落地的诉求。",
    problems: [
      {
        id: "prob-1",
        summary: "新大楼新引进青年博士未能及时享受到高新区一次性租房及生活补贴。",
        category: "人才需求类",
        status: "已转交",
        dueDate: "2026-06-22"
      }
    ],
    owner: "OWN"
  },
  {
    id: "rec-2",
    enterpriseId: "ent-3",
    enterpriseName: "合肥阳光电源股份有限公司",
    createTime: "2026-06-24",
    method: "DHGT",
    recordStatus: 1, // 已提交
    problemCount: 1,
    activeProblemCount: 1,
    latestSummary: "电话回访财务及基建总监，得知企业在屋顶光伏二期并网上面临流动资金流转慢、手续批复滞后等复合性阻碍。",
    problems: [
      {
        id: "prob-2",
        summary: "新园区二期并网高压线杆迁移迟缓，面临 2000 万元流动资金缺口希望协调低息贷款支持。",
        category: "融资贷款类",
        status: "办理中",
        dueDate: "2026-06-14"
      }
    ],
    owner: "OWN"
  },
  {
    id: "rec-3",
    enterpriseId: "ent-2",
    enterpriseName: "安徽江汽集团股份有限公司",
    createTime: "2026-06-10",
    method: "SDZF",
    recordStatus: 1, // 已提交
    problemCount: 1,
    activeProblemCount: 0,
    latestSummary: "经信局多部门会同交警支队在江汽生产基地召开现场协调会。当场决定辟出支路绿道，在22:00-次日06:00对物流重卡解除高峰禁行，顺利办结企业长期未解决的痛点。",
    problems: [
      {
        id: "prob-3",
        summary: "园区西侧支路在上下班高峰重载物流车限行，导致出货效率低下，盼调整限行时段。",
        category: "基础设施类",
        status: "已办结",
        dueDate: "2026-06-10"
      }
    ],
    owner: "OWN"
  },
  {
    id: "rec-4",
    enterpriseId: "ent-5",
    enterpriseName: "合肥本源量子计算科技有限责任公司",
    createTime: "2026-06-26",
    method: "SDZF",
    recordStatus: 0, // 草稿
    problemCount: 0,
    activeProblemCount: 0,
    latestSummary: "这是本季度的例行随访草稿。下午考察了量子计算机超导车间，主要沟通了下个月合肥量子计算应用大会的筹备配合方案，暂未收到新的政务协调难点问题。",
    problems: [],
    owner: "OWN"
  },
  {
    id: "rec-5",
    enterpriseId: "ent-4",
    enterpriseName: "安徽国轩高科动力能源有限公司",
    createTime: "2026-06-18",
    method: "DHGT",
    recordStatus: 1, // 已提交
    problemCount: 1,
    activeProblemCount: 1,
    latestSummary: "电话向国轩项目申报专员详细询问三期锂离子电池包组装项目的环评审批进展。企业表示相关材料已按专家评审意见进行了最终修订并提交，急需市局加快会签审批。",
    problems: [
      {
        id: "prob-4",
        summary: "三期锂离子电池包组装项目环评已经上报，盼协调环保局加快会审审批公示速度。",
        category: "证照办理类",
        status: "收集",
        dueDate: "2026-06-18"
      }
    ],
    owner: "ALL"
  }
];
