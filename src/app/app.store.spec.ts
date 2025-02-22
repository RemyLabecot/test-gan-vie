import { toFullDateString } from './utils/date.utils';
import { ProjectsEnum } from './enum/projects.enum';
import { AgentEnum } from './enum/agents.enum';
import { TestBed, waitForAsync } from '@angular/core/testing';
import {CraGeneratorStore} from './app.store';
import {AllocationByMonth} from './interface/allocation-by-month.interface';
import {AllocationByDay} from './interface/allocation-by-day.interface';
import {Agent} from './interface/agent.interface';

describe('CraGeneratorStore', () => {
  let store: any;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [CraGeneratorStore]
    }).compileComponents();

    store = TestBed.inject(CraGeneratorStore);
  }));

  it('devrait initialiser le store avec les valeurs par défaut', () => {
    expect(store.projects().length).toBe(3);
    expect(store.currentSelectedAgentId()).toBe(1);
    expect(store.currentSelectedProjectId()).toBe(1);
    expect(store.currentMonth()).toBe('');
    expect(store.holidayMode()).toBeFalse();
    expect(store.refreshCalendar()).toBeFalse();
  });

  it('devrait permettre de sélectionner un agent', () => {
    store.setCurrentSelectedAgent({ id: 2, name: AgentEnum.AGENT_2, allocationsParMois: [] });
    expect(store.currentSelectedAgentId()).toBe(2);
  });

  it('devrait permettre de sélectionner un projet', () => {
    store.setCurrentSelectedProject({ id: 3, name: ProjectsEnum.PROJECT_3, agents: [] });
    expect(store.currentSelectedProjectId()).toBe(3);
  });

  it('devrait mettre à jour le mois actuel', () => {
    store.setCurrentMonth('2024-02');
    expect(store.currentMonth()).toBe('2024-02');
  });

  it('devrait activer et désactiver le mode congé', () => {
    store.setWorkMode(true);
    expect(store.holidayMode()).toBeTrue();
    store.setWorkMode(false);
    expect(store.holidayMode()).toBeFalse();
  });

  it('devrait rafraîchir le calendrier', () => {
    store.setRefreshCalendar(true);
    expect(store.refreshCalendar()).toBeTrue();
  });

  it('devrait retourner les agents du projet sélectionné', () => {
    const agents = store.getAgentsByCurrentProject();
    expect(agents.length).toBeGreaterThan(0);
    expect(agents.some((agent: Agent) => agent.name === AgentEnum.AGENT_1)).toBeTrue();
  });

  it('devrait ajouter et retirer une imputation', () => {
    const testDate = new Date('2024-02-20');
    const dateString = toFullDateString(testDate);

    store.toggleDate(testDate);
    let allocations = store.getAllocationsByCurrentAgent().flatMap((imp: AllocationByMonth) => imp.allocationsByDay);
    expect(allocations.some((imp: AllocationByDay) => imp.date === dateString)).toBeTrue();

    store.toggleDate(testDate);
    allocations = store.getAllocationsByCurrentAgent().flatMap((imp: AllocationByMonth) => imp.allocationsByDay);
    expect(allocations.some((imp: AllocationByDay) => imp.date === dateString)).toBeFalse();
  });

  it('devrait retourner le bon nombre d’imputations par mois et par type', () => {
    const testDate = new Date('2024-02-20');
    store.toggleDate(testDate);

    const workingDays = store.getNumberOfAllocationsDaysByMonthAndType('workingDay', store.currentSelectedAgentId(), '2024-02');
    expect(workingDays).toBe(1);

    store.toggleDate(testDate);
    const workingDaysAfterRemoval = store.getNumberOfAllocationsDaysByMonthAndType('workingDay', store.currentSelectedAgentId(), '2024-02');
    expect(workingDaysAfterRemoval).toBe(0);
  });
});
