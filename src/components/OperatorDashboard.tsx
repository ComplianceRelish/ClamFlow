import React from 'react';
import { Tab } from '@headlessui/react';
import { RawMaterialEntry } from './operator/RawMaterialEntry';
import { LotsInProgress } from './operator/LotsInProgress';

export function OperatorDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          <Tab
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700
              ${selected
                ? 'bg-white shadow'
                : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
              }`
            }
          >
            New Raw Material Entry
          </Tab>
          <Tab
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700
              ${selected
                ? 'bg-white shadow'
                : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
              }`
            }
          >
            Lots in Progress
          </Tab>
        </Tab.List>
        <Tab.Panels className="mt-6">
          <Tab.Panel>
            <RawMaterialEntry />
          </Tab.Panel>
          <Tab.Panel>
            <LotsInProgress />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}