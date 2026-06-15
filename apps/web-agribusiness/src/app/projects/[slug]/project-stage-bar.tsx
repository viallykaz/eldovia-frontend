'use client';

import { CheckCircle2, Circle } from 'lucide-react';

const STATUS_CYCLES: Record<string, string[]> = {
  farming:         ['call_for_investors', 'land_preparation', 'planting', 'growing', 'harvesting', 'post_harvest', 'distribution', 'completed'],
  crop_production: ['call_for_investors', 'land_preparation', 'planting', 'growing', 'harvesting', 'post_harvest', 'distribution', 'completed'],
  smart_farming:   ['call_for_investors', 'land_preparation', 'planting', 'growing', 'harvesting', 'post_harvest', 'completed'],
  livestock:       ['call_for_investors', 'procurement', 'rearing', 'breeding', 'processing', 'distribution', 'completed'],
  aquaculture:     ['call_for_investors', 'pond_preparation', 'stocking', 'growth_monitoring', 'harvesting', 'processing', 'completed'],
  forestry:        ['call_for_investors', 'site_preparation', 'planting', 'nurturing', 'harvesting', 'reforestation', 'completed'],
  irrigation:      ['call_for_investors', 'design', 'construction', 'testing', 'commissioning', 'operational', 'completed'],
  food_processing: ['call_for_investors', 'facility_setup', 'equipment_installation', 'trial_production', 'full_production', 'completed'],
  agri_tech:       ['call_for_investors', 'development', 'pilot_testing', 'deployment', 'scaling', 'completed'],
  other:           ['call_for_investors', 'planning', 'implementation', 'monitoring', 'completed'],
};

const STATUS_LABELS: Record<string, string> = {
  call_for_investors: 'Call for Investors',
  land_preparation: 'Land Preparation',
  planting: 'Planting',
  growing: 'Growing',
  harvesting: 'Harvesting',
  post_harvest: 'Post-Harvest',
  distribution: 'Distribution',
  completed: 'Completed',
  procurement: 'Procurement',
  rearing: 'Rearing',
  breeding: 'Breeding',
  processing: 'Processing',
  pond_preparation: 'Pond Preparation',
  stocking: 'Stocking',
  growth_monitoring: 'Growth Monitoring',
  site_preparation: 'Site Preparation',
  nurturing: 'Nurturing',
  reforestation: 'Reforestation',
  design: 'Design',
  construction: 'Construction',
  testing: 'Testing',
  commissioning: 'Commissioning',
  operational: 'Operational',
  facility_setup: 'Facility Setup',
  equipment_installation: 'Equipment Installation',
  trial_production: 'Trial Production',
  full_production: 'Full Production',
  development: 'Development',
  pilot_testing: 'Pilot Testing',
  deployment: 'Deployment',
  scaling: 'Scaling',
  planning: 'Planning',
  implementation: 'Implementation',
  monitoring: 'Monitoring',
};

interface ProjectStageBarProps {
  category: string;
  operationalStatus?: string;
}

export function ProjectStageBar({ category, operationalStatus }: ProjectStageBarProps) {
  const steps = STATUS_CYCLES[category] ?? STATUS_CYCLES.other;
  const currentIdx = operationalStatus ? steps.indexOf(operationalStatus) : -1;

  if (!operationalStatus && currentIdx === -1) return null;

  const progressPct = currentIdx >= 0 ? Math.round(((currentIdx + 1) / steps.length) * 100) : 0;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Project Stage</h2>
        {operationalStatus && (
          <span
            className="rounded-full border px-3 py-1 text-xs font-semibold capitalize"
            style={{ background: 'rgba(251,146,60,0.15)', borderColor: 'rgba(251,146,60,0.4)', color: '#fb923c' }}
          >
            {STATUS_LABELS[operationalStatus] ?? operationalStatus.replace(/_/g, ' ')}
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full bg-gray-100 dark:bg-white/8 mb-5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${progressPct}%`, background: 'linear-gradient(90deg, #0d5730, #22c55e)' }}
        />
      </div>

      {/* Step indicators */}
      <div className="overflow-x-auto pb-2">
        <div className="flex items-start gap-0 min-w-max">
          {steps.map((step, idx) => {
            const isDone = idx < currentIdx;
            const isActive = idx === currentIdx;
            return (
              <div key={step} className="flex items-start">
                <div className="flex flex-col items-center gap-1.5 px-2">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold transition-all ${
                      isActive
                        ? 'border-orange-400 bg-orange-400 text-white shadow-sm'
                        : isDone
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-gray-200 dark:border-white/15 bg-white dark:bg-white/5 text-gray-400 dark:text-white/30'
                    }`}
                  >
                    {isDone ? <CheckCircle2 size={14} /> : isActive ? <span>{idx + 1}</span> : <Circle size={12} />}
                  </div>
                  <span
                    className={`text-[10px] font-medium text-center max-w-[70px] leading-tight whitespace-nowrap ${
                      isActive
                        ? 'text-orange-500 dark:text-orange-400'
                        : isDone
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-gray-400 dark:text-white/30'
                    }`}
                  >
                    {STATUS_LABELS[step] ?? step.replace(/_/g, ' ')}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className="mt-3.5 h-0.5 w-6 shrink-0"
                    style={{ background: idx < currentIdx ? '#22c55e' : 'rgba(0,0,0,0.1)' }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
