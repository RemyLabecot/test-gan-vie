import {signalStore, withMethods, withState} from '@ngrx/signals';
import {CraGeneratorState} from './type/cra-generator-state.type';
import {withDevtools} from '@angular-architects/ngrx-toolkit';
import {Agent} from './interface/agent.interface';
import {immerPatchState} from 'ngrx-immer/signals';
import {toFullDateString} from './utils/date.utils';
import {Project} from './interface/project.interface';
import {ProjectsEnum} from './enum/projects.enum';
import {AgentEnum} from './enum/agents.enum';
import {AllocationByMonth} from './interface/allocation-by-month.interface';


const initialState: CraGeneratorState = {
  projects: [
    {
      id: 1, name: ProjectsEnum.PROJECT_1, agents: [
        {id: 1, name: AgentEnum.AGENT_1, allocationsByMonth: []},
        {id: 2, name: AgentEnum.AGENT_2, allocationsByMonth: []},
        {id: 3, name: AgentEnum.AGENT_3, allocationsByMonth: []},
      ]
    },
    {
      id: 2, name: ProjectsEnum.PROJECT_2, agents: [
        {id: 1, name: AgentEnum.AGENT_1, allocationsByMonth: []},
        {id: 2, name: AgentEnum.AGENT_2, allocationsByMonth: []},
        {id: 3, name: AgentEnum.AGENT_3, allocationsByMonth: []},
      ]
    },
    {
      id: 3, name: ProjectsEnum.PROJECT_3, agents: [
        {id: 1, name: AgentEnum.AGENT_1, allocationsByMonth: []},
        {id: 2, name: AgentEnum.AGENT_2, allocationsByMonth: []},
        {id: 3, name: AgentEnum.AGENT_3, allocationsByMonth: []},
      ]
    },
  ],
  currentSelectedAgentId: 1,
  currentSelectedProjectId: 1,
  currentMonth: '',
  holidayMode: false,
  refreshCalendar: false,
};

export const CraGeneratorStore = signalStore(
  withDevtools('flights'),
  withState(initialState),
  withMethods((store) => ({
    toggleDate(date: Date | null) {
      if (!date) return;
      const dateString = toFullDateString(date);
      const mois = dateString.slice(0, 7);
      immerPatchState(store, (state) => {

        const project = state.projects.find(project => project.id === state?.currentSelectedProjectId);
        const agent = project?.agents.find(agent => agent.id === state?.currentSelectedAgentId);

        if (!agent) return;

        agent.allocationsByMonth ??= [];
        let allocationMonth = agent.allocationsByMonth.find((imp) => imp.mois === mois);

        if (!allocationMonth) {
          allocationMonth = {mois, allocationsByDay: []};
          agent.allocationsByMonth.push(allocationMonth);
        }

        const allocations = allocationMonth.allocationsByDay ??= [];
        const index = allocations.findIndex((imp) => imp.date === dateString);

        index === -1
          ? allocations.push({date: dateString, type: state.holidayMode ? 'dayOff' : 'workingDay'})
          : allocations.splice(index, 1);

        state.currentSelectedAgentId = agent.id;
        state.currentSelectedProjectId = project?.id ? project.id : 0;
      });
    },
    refreshHolidayMode() {
      immerPatchState(store, (state) => {
        const project = state.projects.find(project => project.id === state?.currentSelectedProjectId);
        const agent = project?.agents.find(agent => agent.id === state?.currentSelectedAgentId);
        if (!agent) return;
        let dayOffAllocations = this.getNumberOfAllAllocationsDaysByTypeAndAgentId('dayOff', agent.id);
        if (!(state.holidayMode && dayOffAllocations < 7)) {
          state.holidayMode = false;
        }
      });
    },
    setCurrentSelectedAgent(agent: Agent | null) {
      immerPatchState(store, (state) => {
        state.currentSelectedAgentId = agent ? agent.id : 0;
      });
    },
    setCurrentSelectedProject(project: Project | null) {
      immerPatchState(store, (state) => {
        state.currentSelectedProjectId = project ? project.id : 0;
      });
    },
    setCurrentMonth(month: string) {
      immerPatchState(store, (state) => {
        state.currentMonth = month;
      });
    },
    setWorkMode(workMode: boolean) {
      immerPatchState(store, (state) => {
        state.holidayMode = workMode;
      });
    },
    setRefreshCalendar(refresh: boolean) {
      immerPatchState(store, (state) => {
        state.refreshCalendar = refresh;
      });
    },
    getAgentsByCurrentProject() {
      return store.projects().find((project) => project.id === store.currentSelectedProjectId())?.agents ?? [];
    },
    getAllocationsByCurrentAgent(): AllocationByMonth[] {
      return store.projects()
        .find((project) => project.id === store.currentSelectedProjectId())?.agents
        .find((agent) => agent.id === store.currentSelectedAgentId())?.allocationsByMonth ?? [];
    },
    getAgentByCurrentAgentId(): Agent {
      return store.projects()
        .find((project) => project.id === store.currentSelectedProjectId())?.agents
        .find((agent) => agent.id === store.currentSelectedAgentId()) ?? {id: 0, name: '', allocationsByMonth: []};
    },
    getProjectByCurrentProjectId(): Project {
      return store.projects().find((project) => project.id === store.currentSelectedProjectId()) ?? {
        id: 0,
        name: '',
        agents: []
      };
    },
    getNumberOfAllocationsDaysByMonth() {
      return store.projects()
        .find((project) => project.id === store.currentSelectedProjectId())?.agents
        .find((agent) => agent.id === store.currentSelectedAgentId())?.allocationsByMonth.find((imp) => imp.mois === store.currentMonth())?.allocationsByDay.length ?? 0;
    },
    getNumberOfAllocationsDaysByMonthAndType(type: string, agentId: number, month: string) {
      return store.projects()
        .find((project) => project.id === store.currentSelectedProjectId())?.agents
        .find((agent) => agent.id === agentId)?.allocationsByMonth
        .find((imp) => imp.mois === month)?.allocationsByDay
        .filter((imp) => imp.type === type).length ?? 0;
    },
    getNumberOfAllAllocationsDaysByTypeAndAgentId(type: string, agentId: number): number {
        return store.projects()
          .flatMap(project => project.agents)
          .filter(agent => agent.id === agentId)
          .flatMap(agent => agent.allocationsByMonth)
          .flatMap(allocationMonth => allocationMonth.allocationsByDay)
          .filter(allocationJour => allocationJour.type === type)
          .length;
    },
  }))
);
