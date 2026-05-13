// =======================================================
// FILE: lib/i18n.ts
// Replace your current lib/i18n.ts with this full file.
// =======================================================

export type Language = 'en' | 'ar'

export const translations = {
  en: {
    // General
    language: 'Language',
    english: 'English',
    arabic: 'العربية',
    live: 'Live',
    role: 'Role',
    admin: 'Admin',
    viewer: 'Viewer',
    manager: 'Manager',
    operator: 'Operator',
    loading: 'Loading AI Operations Layer...',
    noData: 'No data available.',
    noDescription: 'No description provided.',
    unassigned: 'Unassigned',
    enabled: 'Enabled',
    disabled: 'Disabled',
    active: 'Active',
    inactive: 'Inactive',
    status: 'Status',
    priority: 'Priority',
    actions: 'Actions',
    owner: 'Owner',
    dueDate: 'Due Date',
    createdAt: 'Created At',
    assignedTo: 'Assigned To',
    search: 'Search',
    filter: 'Filter',
    all: 'All',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    close: 'Close',
    view: 'View',
    refresh: 'Refresh',
    export: 'Export',
    logout: 'Logout',

    // AppShell / Navigation
    appName: 'AI Ops',
    operationsLayer: 'Operations Layer',
    dashboard: 'Dashboard',
    executiveCommand: 'Executive Command',
    executiveDashboard: 'Executive Dashboard',
    analytics: 'Analytics',
    operations: 'Operations',
    feedView: 'Feed View',
    kanbanBoard: 'Kanban Board',
    newOperation: 'New Operation',
    aiCenter: 'AI Center',
    aiCommandCenter: 'AI Command Center',
    aiMissionPlanning: 'AI Mission Planning',
    aiInsights: 'AI Insights',
    predictiveOps: 'Predictive Ops',
    automation: 'Automation',
    automationControl: 'Automation Control',
    teamCoordination: 'Team Coordination',
    monitoring: 'Monitoring',
    notifications: 'Notifications',
    configuration: 'Configuration',
    settings: 'Settings',
    operationsDashboard: 'Operations Dashboard',
    realtimeMonitoring: 'Real-time AI operations monitoring',

    // Page header
    pageKicker: 'AI Operations Layer',
    operationsAnalytics: 'Operations Analytics',
    operationsAnalyticsSubtitle:
      'Real-time overview of operations, workflows, priorities and AI-driven insights.',

    // Operations
    createNewOperation: 'Create New Operation',
    createNewOperationSubtitle:
      'Add a new operational case and let AI analyze priority, category and recommended action.',
    viewOnlyAccess: 'You have view-only access.',
    operationSaved: 'Operation saved successfully',
    operationCreateDenied: 'You do not have permission to create operations',
    operationAnalyzeDenied: 'You do not have permission to analyze operations',
    aiAnalysisFailed: 'AI analysis failed',
    onlyAdminDelete: 'Only admin can delete operations',
    confirmDeleteOperation: 'Are you sure you want to delete this operation?',
    failedDeleteOperation: 'Failed to delete operation',

    // Statuses
    new: 'New',
    inProgress: 'In Progress',
    waiting: 'Waiting',
    completed: 'Completed',
    cancelled: 'Cancelled',
    overdue: 'Overdue',
    dueToday: 'Due Today',
    onTrack: 'On Track',

    // Priorities
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical',

    // Executive Command View
    executiveCommandView: 'Executive Command View',
    executiveCommandDescription:
      'Consolidated leadership view combining threat level, operational pulse, forecast risk, SLA health, critical watchlist and AI executive recommendations.',
    criticalCommandAttention: 'Critical Command Attention',
    elevatedOperationalPressure: 'Elevated Operational Pressure',
    operationalPictureStable: 'Operational Picture Stable',
    threatLevel: 'Threat Level',
    operationalPulse: 'Operational Pulse',
    teamLoadSummary: 'Team Load Summary',
    activeOperations: 'Active Operations',
    criticalWatchlist: 'Critical Watchlist',
    slaBreaches: 'SLA Breaches',
    forecastRisk: 'Forecast Risk',
    aiExecutiveRecommendations: 'AI Executive Recommendations',
    executiveRecommendationsSubtitle:
      'Decision-support actions generated from current operational conditions.',
    forecastRiskSignals: 'Forecast Risk Signals',
    executiveLiveFeed: 'Executive Live Feed',
    noExecutiveEvents: 'No executive events.',
    noCriticalWatchlistItems: 'No critical watchlist items.',
    noImmediateExecutiveAction:
      'Current operating picture is stable. No immediate executive action required.',
    readiness: 'Readiness',
    forecast: 'Forecast',
    pulse: 'Pulse',
    completion: 'Completion',
    activeLoad: 'Active Load',
    riskExposure: 'Risk Exposure',
    operationalReadiness: 'Operational Readiness',
    threatScore: 'Threat Score',
    waitingQueue: 'Waiting Queue',
    completedOps: 'Completed Ops',

    // AI Mission Planning
    missionPlanningTitle: 'AI Mission Planning',
    crisisStabilizationMission: 'Crisis Stabilization Mission',
    riskReductionMission: 'Risk Reduction Mission',
    capacityOptimizationMission: 'Capacity Optimization Mission',
    readinessSustainmentMission: 'Readiness Sustainment Mission',
    aiGeneratedMissionPlan: 'AI Generated Mission Plan',
    aiGeneratedMissionPlanSubtitle:
      'Recommended execution sequence based on current operational pressure, SLA risk and team workload.',
    resourceAllocation: 'Resource Allocation',
    operationalSimulation: 'Operational Simulation',
    operationalSimulationSubtitle:
      'Scenario-based forecast showing expected mission impact if key operational actions are executed.',
    missionSignals: 'Mission Signals',
    missionReadiness: 'Mission Readiness',
    riskPressure: 'Risk Pressure',
    workloadPressure: 'Workload Pressure',
    actionSteps: 'Action Steps',

    // AI Command Center
    liveOperations: 'Live Operations',
    aiRiskRadar: 'AI Risk Radar',
    slaMonitoring: 'SLA Monitoring',
    realtimeAlerts: 'Realtime Alerts',
    aiRecommendations: 'AI Recommendations',
    suggestedOperationalActions: 'Suggested operational actions',
    operationalHeatmap: 'Operational Heatmap',
    operationalHeatmapSubtitle: 'AI distribution of operational pressure',

    // Automation
    automationControlCenter: 'Automation Control Center',
    automationControlSubtitle:
      'Manage AI workflow automation rules, triggers and operational actions.',
    activeAutomationRules: 'Active Automation Rules',
    totalRules: 'Total Rules',
    operationsScope: 'Operations Scope',

    // Team
    teamCoordinationCenter: 'Team Coordination Center',
    teamCoordinationSubtitle:
      'Monitor team workload, availability, specialization and operational capacity.',
    availableMembers: 'Available Members',
    teamMembers: 'Team Members',
    workloadRate: 'Workload Rate',
    overloaded: 'Overloaded',
    teamWorkloadDistribution: 'Team Workload Distribution',

    // Predictive
    predictiveOperationsEngine: 'Predictive Operations Engine',
    predictiveOperationsSubtitle:
      'AI-powered forecast for future SLA breaches, escalation probability, workload pressure and operational degradation.',
    predictedOperationalRisks: 'Predicted Operational Risks',
    escalationProbability: 'Escalation Probability',
    slaForecastRisk: 'SLA Forecast Risk',
    overloadProbability: 'Overload Probability',
    operationalForecast: 'Operational Forecast',
    forecastSignals: 'Forecast Signals',

    // Notifications
    notificationsHub: 'Notifications Hub',
    notificationsHubSubtitle:
      'Centralized operational notifications from SLA, risk, workflow and assignment signals.',
    totalNotifications: 'Total Notifications',
    liveNotificationStream: 'Live Notification Stream',

    // Settings
    systemSettings: 'System Settings',
    systemSettingsSubtitle:
      'Manage system profile, AI status and operational configuration.',
    currentRole: 'Current Role',
    aiEngine: 'AI Engine',
    database: 'Database',
    platformConfiguration: 'Platform Configuration',
    systemName: 'System Name',
    mode: 'Mode',
    workflowAutomation: 'Workflow Automation',
    smartAssignment: 'Smart Assignment',
    predictiveOperations: 'Predictive Operations',
    notificationsHubSetting: 'Notifications Hub',
    realtimeMonitoringMode: 'Realtime Monitoring',
  },

  ar: {
    // General
    language: 'اللغة',
    english: 'English',
    arabic: 'العربية',
    live: 'متصل',
    role: 'الدور',
    admin: 'مدير النظام',
    viewer: 'مشاهد',
    manager: 'مدير',
    operator: 'مشغل',
    loading: 'جاري تحميل طبقة العمليات الذكية...',
    noData: 'لا توجد بيانات متاحة.',
    noDescription: 'لا يوجد وصف.',
    unassigned: 'غير مسندة',
    enabled: 'مفعل',
    disabled: 'معطل',
    active: 'نشط',
    inactive: 'غير نشط',
    status: 'الحالة',
    priority: 'الأولوية',
    actions: 'الإجراءات',
    owner: 'المسؤول',
    dueDate: 'تاريخ الاستحقاق',
    createdAt: 'تاريخ الإنشاء',
    assignedTo: 'مسندة إلى',
    search: 'بحث',
    filter: 'تصفية',
    all: 'الكل',
    save: 'حفظ',
    cancel: 'إلغاء',
    edit: 'تعديل',
    delete: 'حذف',
    close: 'إغلاق',
    view: 'عرض',
    refresh: 'تحديث',
    export: 'تصدير',
    logout: 'تسجيل الخروج',

    // AppShell / Navigation
    appName: 'AI Ops',
    operationsLayer: 'اقسام العمليات',
    dashboard: 'لوحة التحكم',
    executiveCommand: 'مركز القيادة التنفيذي',
    executiveDashboard: 'لوحة القيادة التنفيذية',
    analytics: 'التحليلات',
    operations: 'العمليات',
    feedView: 'عرض القائمة',
    kanbanBoard: 'لوحة كانبان',
    newOperation: 'عملية جديدة',
    aiCenter: 'مركز الذكاء الاصطناعي',
    aiCommandCenter: 'مركز قيادة الذكاء الاصطناعي',
    aiMissionPlanning: 'تخطيط المهام بالذكاء الاصطناعي',
    aiInsights: 'رؤى الذكاء الاصطناعي',
    predictiveOps: 'العمليات التنبؤية',
    automation: 'الأتمتة',
    automationControl: 'التحكم في الأتمتة',
    teamCoordination: 'تنسيق الفرق',
    monitoring: 'المراقبة',
    notifications: 'الإشعارات',
    configuration: 'الإعدادات',
    settings: 'الإعدادات',
    operationsDashboard: 'لوحة العمليات',
    realtimeMonitoring: 'مراقبة العمليات بالذكاء الاصطناعي لحظيًا',

    // Page header
    pageKicker: 'طبقة العمليات الذكية',
    operationsAnalytics: 'تحليلات العمليات',
    operationsAnalyticsSubtitle:
      'نظرة عامة فورية على العمليات، سير العمل، الأولويات والرؤى المدعومة بالذكاء الاصطناعي.',

    // Operations
    createNewOperation: 'إنشاء عملية جديدة',
    createNewOperationSubtitle:
      'أضف حالة تشغيلية جديدة ودع الذكاء الاصطناعي يحلل الأولوية والتصنيف والإجراء المقترح.',
    viewOnlyAccess: 'لديك صلاحية عرض فقط.',
    operationSaved: 'تم حفظ العملية بنجاح',
    operationCreateDenied: 'ليس لديك صلاحية إنشاء العمليات',
    operationAnalyzeDenied: 'ليس لديك صلاحية تحليل العمليات',
    aiAnalysisFailed: 'فشل تحليل الذكاء الاصطناعي',
    onlyAdminDelete: 'الحذف متاح لمدير النظام فقط',
    confirmDeleteOperation: 'هل أنت متأكد من حذف هذه العملية؟',
    failedDeleteOperation: 'فشل حذف العملية',

    // Statuses
    new: 'جديدة',
    inProgress: 'قيد التنفيذ',
    waiting: 'في الانتظار',
    completed: 'مكتملة',
    cancelled: 'ملغاة',
    overdue: 'متأخرة',
    dueToday: 'مستحقة اليوم',
    onTrack: 'ضمن المسار',

    // Priorities
    low: 'منخفضة',
    medium: 'متوسطة',
    high: 'عالية',
    critical: 'حرجة',

    // Executive Command View
    executiveCommandView: 'عرض القيادة التنفيذي',
    executiveCommandDescription:
      'عرض موحد للقيادة يجمع مستوى التهديد، النبض التشغيلي، المخاطر المتوقعة، صحة SLA، قائمة المراقبة الحرجة وتوصيات الذكاء الاصطناعي التنفيذية.',
    criticalCommandAttention: 'انتباه القيادة الحرجة',
    elevatedOperationalPressure: 'ضغط تشغيلي مرتفع',
    operationalPictureStable: 'الصورة التشغيلية مستقرة',
    threatLevel: 'مستوى التهديد',
    operationalPulse: 'النبض التشغيلي',
    teamLoadSummary: 'ملخص عبء الفرق',
    activeOperations: 'العمليات النشطة',
    criticalWatchlist: 'قائمة المراقبة الحرجة',
    slaBreaches: 'انتهاكات SLA',
    forecastRisk: 'المخاطر المتوقعة',
    aiExecutiveRecommendations: 'توصيات الذكاء الاصطناعي التنفيذية',
    executiveRecommendationsSubtitle:
      'إجراءات دعم القرار المستخرجة من الحالة التشغيلية الحالية.',
    forecastRiskSignals: 'مؤشرات المخاطر المتوقعة',
    executiveLiveFeed: 'التدفق التنفيذي المباشر',
    noExecutiveEvents: 'لا توجد أحداث تنفيذية.',
    noCriticalWatchlistItems: 'لا توجد عناصر مراقبة حرجة.',
    noImmediateExecutiveAction:
      'الصورة التشغيلية الحالية مستقرة. لا يلزم إجراء تنفيذي فوري.',
    readiness: 'الجاهزية',
    forecast: 'التوقع',
    pulse: 'النبض',
    completion: 'الإنجاز',
    activeLoad: 'الحمل النشط',
    riskExposure: 'التعرض للمخاطر',
    operationalReadiness: 'الجاهزية التشغيلية',
    threatScore: 'درجة التهديد',
    waitingQueue: 'قائمة الانتظار',
    completedOps: 'العمليات المكتملة',

    // AI Mission Planning
    missionPlanningTitle: 'تخطيط المهام بالذكاء الاصطناعي',
    crisisStabilizationMission: 'مهمة استقرار الأزمات',
    riskReductionMission: 'مهمة خفض المخاطر',
    capacityOptimizationMission: 'مهمة تحسين القدرة التشغيلية',
    readinessSustainmentMission: 'مهمة المحافظة على الجاهزية',
    aiGeneratedMissionPlan: 'خطة مهمة مولدة بالذكاء الاصطناعي',
    aiGeneratedMissionPlanSubtitle:
      'تسلسل تنفيذ مقترح بناءً على الضغط التشغيلي الحالي، مخاطر SLA وعبء الفرق.',
    resourceAllocation: 'توزيع الموارد',
    operationalSimulation: 'المحاكاة التشغيلية',
    operationalSimulationSubtitle:
      'توقع قائم على السيناريوهات يوضح أثر تنفيذ الإجراءات التشغيلية الرئيسية.',
    missionSignals: 'مؤشرات المهمة',
    missionReadiness: 'جاهزية المهمة',
    riskPressure: 'ضغط المخاطر',
    workloadPressure: 'ضغط عبء العمل',
    actionSteps: 'خطوات التنفيذ',

    // AI Command Center
    liveOperations: 'العمليات الحية',
    aiRiskRadar: 'رادار مخاطر الذكاء الاصطناعي',
    slaMonitoring: 'مراقبة SLA',
    realtimeAlerts: 'التنبيهات الفورية',
    aiRecommendations: 'توصيات الذكاء الاصطناعي',
    suggestedOperationalActions: 'إجراءات تشغيلية مقترحة',
    operationalHeatmap: 'خريطة الضغط التشغيلي',
    operationalHeatmapSubtitle: 'توزيع الضغط التشغيلي بواسطة الذكاء الاصطناعي',

    // Automation
    automationControlCenter: 'مركز التحكم في الأتمتة',
    automationControlSubtitle:
      'إدارة قواعد أتمتة سير العمل، المحفزات والإجراءات التشغيلية.',
    activeAutomationRules: 'قواعد الأتمتة النشطة',
    totalRules: 'إجمالي القواعد',
    operationsScope: 'نطاق العمليات',

    // Team
    teamCoordinationCenter: 'مركز تنسيق الفرق',
    teamCoordinationSubtitle:
      'مراقبة عبء الفرق، التوفر، التخصص والقدرة التشغيلية.',
    availableMembers: 'الأعضاء المتاحون',
    teamMembers: 'أعضاء الفريق',
    workloadRate: 'معدل عبء العمل',
    overloaded: 'ضغط زائد',
    teamWorkloadDistribution: 'توزيع عبء العمل على الفرق',

    // Predictive
    predictiveOperationsEngine: 'محرك العمليات التنبؤية',
    predictiveOperationsSubtitle:
      'توقع مدعوم بالذكاء الاصطناعي لانتهاكات SLA المستقبلية، احتمالية التصعيد، ضغط عبء العمل والتدهور التشغيلي.',
    predictedOperationalRisks: 'المخاطر التشغيلية المتوقعة',
    escalationProbability: 'احتمالية التصعيد',
    slaForecastRisk: 'مخاطر SLA المتوقعة',
    overloadProbability: 'احتمالية الضغط الزائد',
    operationalForecast: 'التوقع التشغيلي',
    forecastSignals: 'مؤشرات التوقع',

    // Notifications
    notificationsHub: 'مركز الإشعارات',
    notificationsHubSubtitle:
      'إشعارات تشغيلية مركزية من مؤشرات SLA والمخاطر وسير العمل والإسناد.',
    totalNotifications: 'إجمالي الإشعارات',
    liveNotificationStream: 'تدفق الإشعارات المباشر',

    // Settings
    systemSettings: 'إعدادات النظام',
    systemSettingsSubtitle:
      'إدارة ملف النظام، حالة الذكاء الاصطناعي والتكوين التشغيلي.',
    currentRole: 'الدور الحالي',
    aiEngine: 'محرك الذكاء الاصطناعي',
    database: 'قاعدة البيانات',
    platformConfiguration: 'تكوين المنصة',
    systemName: 'اسم النظام',
    mode: 'الوضع',
    workflowAutomation: 'أتمتة سير العمل',
    smartAssignment: 'الإسناد الذكي',
    predictiveOperations: 'العمليات التنبؤية',
    notificationsHubSetting: 'مركز الإشعارات',
    realtimeMonitoringMode: 'المراقبة اللحظية',
  },
} as const

export type TranslationKey = keyof typeof translations.en
export type TranslationObject = typeof translations.en
