"use client";

import { useReducer, useState, type ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { assertNever } from "@/lib/assert-never";
import { passportReducer, type PassportState } from "../model/passport-reducer";
import type { StageAction } from "../model/stage-flow";
import { DEFAULT_TAB_ID, PASSPORT_TABS, isTabId, type TabId } from "../model/tabs";
import type { StageId } from "../model/types";
import { EstimateTab } from "./estimate-tab";
import { StagesTab } from "./stages-tab";

interface PassportWorkspaceProps {
  readonly initial: PassportState;
  readonly mainTab: ReactNode;
}

export function PassportWorkspace({ initial, mainTab }: PassportWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<TabId>(DEFAULT_TAB_ID);
  const [state, dispatch] = useReducer(passportReducer, initial);

  const transitionStage = (id: StageId, action: StageAction): void => {
    dispatch({ type: "stage/transitioned", id, action });
  };

  const renderPanel = (tab: TabId): ReactNode => {
    switch (tab) {
      case "main":
        return mainTab;
      case "stages":
        return <StagesTab stages={state.stages} onTransition={transitionStage} />;
      case "estimate":
        return <EstimateTab items={state.estimate} />;
      default:
        return assertNever(tab);
    }
  };

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => {
        if (isTabId(value)) setActiveTab(value);
      }}
      className="mt-6 gap-6"
    >
      <TabsList className="w-full justify-start overflow-x-auto">
        {PASSPORT_TABS.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id} className="shrink-0">
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.shortLabel}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      {PASSPORT_TABS.map((tab) => (
        <TabsContent key={tab.id} value={tab.id}>
          {renderPanel(tab.id)}
        </TabsContent>
      ))}
    </Tabs>
  );
}
