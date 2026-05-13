'use client'

import {
  Activity,
  BarChart3,
  BellRing,
  Bot,
  Brain,
  KanbanSquare,
  LayoutDashboard,
  LineChart,
  ListChecks,
  LogOut,
  PlusCircle,
  Settings,
  Target,
  Users,
} from 'lucide-react'

import { supabase } from '../lib/supabase'
import LanguageSwitcher from './LanguageSwitcher'
import RoleBadge from './RoleBadge'

export default function AppShell({
  children,
  role = 'viewer',
  activeView,
  setActiveView,
  language = 'en',
  setLanguage,
  t = {},
}: any) {
  const isArabic = language === 'ar'

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.reload()
  }

  const text = {
    dashboard: t.dashboard || 'Dashboard',
    analytics: t.analytics || 'Analytics',
    operations: t.operations || 'Operations',
    aiCenter: t.aiCenter || 'AI Center',
    automation: t.automation || 'Automation',
    monitoring: t.monitoring || 'Monitoring',
    configuration: t.configuration || 'Configuration',
    executiveCommand: t.executiveCommand || 'Executive Command',
    executiveDashboard: t.executiveDashboard || 'Executive Dashboard',
    feedView: t.feedView || 'Feed View',
    kanbanBoard: t.kanbanBoard || 'Kanban Board',
    newOperation: t.newOperation || 'New Operation',
    aiCommandCenter: t.aiCommandCenter || 'AI Command Center',
    aiMissionPlanning: t.aiMissionPlanning || 'AI Mission Planning',
    aiInsights: t.aiInsights || 'AI Insights',
    predictiveOps: t.predictiveOps || 'Predictive Ops',
    automationControl: t.automationControl || 'Automation Control',
    teamCoordination: t.teamCoordination || 'Team Coordination',
    notifications: t.notifications || 'Notifications',
    settings: t.settings || 'Settings',
    logout: t.logout || 'Logout',
    live: t.live || 'Live',
    operationsDashboard: t.operationsDashboard || 'Operations Dashboard',
    realtimeMonitoring:
      t.realtimeMonitoring || 'Real-time AI operations monitoring',
  }

  const sections = [
    {
      title: text.dashboard,
      items: [
        {
          key: 'executive',
          label: text.executiveCommand,
          icon: <Activity size={18} />,
        },
        {
          key: 'dashboard',
          label: text.executiveDashboard,
          icon: <LayoutDashboard size={18} />,
        },
        {
          key: 'analytics',
          label: text.analytics,
          icon: <BarChart3 size={18} />,
        },
      ],
    },
    {
      title: text.operations,
      items: [
        {
          key: 'feed',
          label: text.feedView,
          icon: <ListChecks size={18} />,
        },
        {
          key: 'board',
          label: text.kanbanBoard,
          icon: <KanbanSquare size={18} />,
        },
        {
          key: 'create',
          label: text.newOperation,
          icon: <PlusCircle size={18} />,
        },
      ],
    },
    {
      title: text.aiCenter,
      items: [
        {
          key: 'command',
          label: text.aiCommandCenter,
          icon: <Activity size={18} />,
        },
        {
          key: 'mission',
          label: text.aiMissionPlanning,
          icon: <Target size={18} />,
        },
        {
          key: 'insights',
          label: text.aiInsights,
          icon: <Brain size={18} />,
        },
        {
          key: 'predictive',
          label: text.predictiveOps,
          icon: <LineChart size={18} />,
        },
      ],
    },
    {
      title: text.automation,
      items: [
        {
          key: 'automation',
          label: text.automationControl,
          icon: <Bot size={18} />,
        },
        {
          key: 'team',
          label: text.teamCoordination,
          icon: <Users size={18} />,
        },
      ],
    },
    {
      title: text.monitoring,
      items: [
        {
          key: 'notifications',
          label: text.notifications,
          icon: <BellRing size={18} />,
        },
      ],
    },
    {
      title: text.configuration,
      items: [
        {
          key: 'settings',
          label: text.settings,
          icon: <Settings size={18} />,
        },
      ],
    },
  ]

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#f3f6fb] text-slate-950"
    >
      <aside
        className={`fixed top-0 z-50 hidden h-screen w-80 border-slate-200 bg-white/95 shadow-[0_0_40px_rgba(15,23,42,0.05)] backdrop-blur-xl lg:block ${
          isArabic ? 'right-0 border-l' : 'left-0 border-r'
        }`}
      >
        <div className="flex h-full flex-col p-6">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-black tracking-tight text-slate-950">
              AI Ops
            </h1>

            <p className="mt-1 text-sm font-medium text-slate-500">
              {isArabic ? 'طبقة العمليات' : 'Operations Layer'}
            </p>

            <div className="mt-4 flex justify-center">
              <RoleBadge role={role} />
            </div>
          </div>

          <nav className="flex-1 space-y-7 overflow-y-auto pb-6 pr-1">
            {sections.map((section) => (
              <div key={section.title}>
                <p
                  className={`mb-2 px-3 text-xs font-black uppercase tracking-[0.18em] text-slate-400 ${
                    isArabic ? 'text-right' : 'text-left'
                  }`}
                >
                  {section.title}
                </p>

                <div className="space-y-1.5">
                  {section.items.map((item) => (
                    <SidebarItem
                      key={item.key}
                      icon={item.icon}
                      label={item.label}
                      active={activeView === item.key}
                      onClick={() => setActiveView(item.key)}
                      isArabic={isArabic}
                    />
                  ))}
                </div>
              </div>
            ))}
          </nav>

          <div className="border-t border-slate-200 pt-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-black text-red-600 transition hover:bg-red-100"
            >
              <LogOut size={18} />
              {text.logout}
            </button>
          </div>
        </div>
      </aside>

      <div className={isArabic ? 'lg:pr-80' : 'lg:pl-80'}>
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/85 px-6 py-4 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4">
            <div className={isArabic ? 'text-right' : 'text-left'}>
              <h2 className="text-xl font-black tracking-tight text-slate-950">
                {text.operationsDashboard}
              </h2>

              <p className="mt-1 text-sm font-medium text-slate-500">
                {text.realtimeMonitoring}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {setLanguage && (
                <LanguageSwitcher
                  language={language}
                  setLanguage={setLanguage}
                />
              )}

              <RoleBadge role={role} />

              <div className="rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white shadow-sm">
                {text.live}
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}

function SidebarItem({ icon, label, active = false, onClick, isArabic }: any) {
  return (
    <button
      onClick={onClick}
      className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${
        isArabic ? 'flex-row-reverse text-right' : 'text-left'
      } ${
        active
          ? 'bg-slate-950 text-white shadow-[0_10px_30px_rgba(15,23,42,0.16)]'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
      }`}
    >
      <span
        className={`flex shrink-0 items-center justify-center ${
          active ? 'text-white' : 'text-slate-500 group-hover:text-slate-950'
        }`}
      >
        {icon}
      </span>

      <span className="min-w-0 flex-1 truncate">{label}</span>
    </button>
  )
}
