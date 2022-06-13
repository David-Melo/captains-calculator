import { Action } from "state/_types";
import { MachineId } from '../../app/effects/loadJsonData';

export const selectMachine: Action<MachineId|null> = async ({state}, machineId) => {
    state.machines.currentItemId = machineId
}