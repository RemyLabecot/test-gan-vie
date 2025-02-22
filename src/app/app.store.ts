import {signalStore, withMethods, withState} from '@ngrx/signals';
import {CraGeneratorState} from './type/cra-generator-state.type';
import {withDevtools} from '@angular-architects/ngrx-toolkit';
import {Agent} from './interface/agent.interface';
import {immerPatchState} from 'ngrx-immer/signals';
import {toFullDateString} from './utils/date.utils';
import {Project} from './interface/project.interface';
import {ProjectsEnum} from './enum/projects.enum';
import {AgentEnum} from './enum/agents.enum';
import {ImputationMois} from './interface/imputation-mois.interface';


const initialState: CraGeneratorState = {
  projects: [
    {
      id: 1, nom: ProjectsEnum.PROJECT_1, agents: [
        {id: 1, nom: AgentEnum.AGENT_1, imputationsParMois: []},
        {id: 2, nom: AgentEnum.AGENT_2, imputationsParMois: []},
        {id: 3, nom: AgentEnum.AGENT_3, imputationsParMois: []},
      ]
    },
    {
      id: 2, nom: ProjectsEnum.PROJECT_2, agents: [
        {id: 1, nom: AgentEnum.AGENT_1, imputationsParMois: []},
        {id: 2, nom: AgentEnum.AGENT_2, imputationsParMois: []},
        {id: 3, nom: AgentEnum.AGENT_3, imputationsParMois: []},
      ]
    },
    {
      id: 3, nom: ProjectsEnum.PROJECT_3, agents: [
        {id: 1, nom: AgentEnum.AGENT_1, imputationsParMois: []},
        {id: 2, nom: AgentEnum.AGENT_2, imputationsParMois: []},
        {id: 3, nom: AgentEnum.AGENT_3, imputationsParMois: []},
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

        agent.imputationsParMois ??= [];
        let imputationMois = agent.imputationsParMois.find((imp) => imp.mois === mois);

        if (!imputationMois) {
          imputationMois = {mois, imputations: []};
          agent.imputationsParMois.push(imputationMois);
        }

        const imputations = imputationMois.imputations ??= [];
        const index = imputations.findIndex((imp) => imp.date === dateString);

        index === -1
          ? imputations.push({date: dateString, type: state.holidayMode ? 'dayOff' : 'workingDay'})
          : imputations.splice(index, 1);

        state.currentSelectedAgentId = agent.id;
        state.currentSelectedProjectId = project?.id ? project.id : 0;
      });
    },
    refreshHolidayMode() {
      immerPatchState(store, (state) => {
        const project = state.projects.find(project => project.id === state?.currentSelectedProjectId);
        const agent = project?.agents.find(agent => agent.id === state?.currentSelectedAgentId);
        if (!agent) return;
        let dayOffImputations = this.getNumberOfAllImputationsDaysByTypeAndAgentId('dayOff', agent.id);
        if (!(state.holidayMode && dayOffImputations < 7)) {
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
    getImputationsByCurrentAgent(): ImputationMois[] {
      return store.projects()
        .find((project) => project.id === store.currentSelectedProjectId())?.agents
        .find((agent) => agent.id === store.currentSelectedAgentId())?.imputationsParMois ?? [];
    },
    getAgentByCurrentAgentId(): Agent {
      return store.projects()
        .find((project) => project.id === store.currentSelectedProjectId())?.agents
        .find((agent) => agent.id === store.currentSelectedAgentId()) ?? {id: 0, nom: '', imputationsParMois: []};
    },
    getProjectByCurrentProjectId(): Project {
      return store.projects().find((project) => project.id === store.currentSelectedProjectId()) ?? {
        id: 0,
        nom: '',
        agents: []
      };
    },
    getNumberOfImputationsDaysByMonth() {
      return store.projects()
        .find((project) => project.id === store.currentSelectedProjectId())?.agents
        .find((agent) => agent.id === store.currentSelectedAgentId())?.imputationsParMois.find((imp) => imp.mois === store.currentMonth())?.imputations.length ?? 0;
    },
    getNumberOfImputationsDaysByMonthAndType(type: string, agentId: number, month: string) {
      return store.projects()
        .find((project) => project.id === store.currentSelectedProjectId())?.agents
        .find((agent) => agent.id === agentId)?.imputationsParMois
        .find((imp) => imp.mois === month)?.imputations
        .filter((imp) => imp.type === type).length ?? 0;
    },
    getNumberOfAllImputationsDaysByTypeAndAgentId(type: string, agentId: number): number {
        return store.projects()
          .flatMap(project => project.agents)
          .filter(agent => agent.id === agentId)
          .flatMap(agent => agent.imputationsParMois)
          .flatMap(imputationMois => imputationMois.imputations)
          .filter(imputationJour => imputationJour.type === type)
          .length;
    },
  }))
);
