import { useState } from "react";
import type {
  Person,
  Panel,
  ActivityTab,
} from "@/modules/reel/model/reel-proximity/reel-proximity.types";

export function useReelPanelState() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [panel, setPanel] = useState<Panel>(null);
  const [activityTab, setActivityTab] = useState<ActivityTab>("notifications");

  const openProfile = (person: Person) => {
    setPanel(null);
    setSelectedPerson(person);
  };
  const closeProfile = () => setSelectedPerson(null);
  const openActivity = (tab: ActivityTab) => {
    setActivityTab(tab);
    setPanel("activity");
  };

  return {
    selectedPerson,
    setSelectedPerson,
    panel,
    setPanel,
    activityTab,
    setActivityTab,
    openProfile,
    closeProfile,
    openActivity,
  };
}
