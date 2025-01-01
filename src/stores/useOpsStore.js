import { defineStore } from "pinia";

export const useOpsStore = defineStore("operations", {
    state: () => ({
        operations: [
            { oId: "1", name: "Documents" },
            { oId: "2", name: "Supply" },
            { oId: "3", name: "Laser" },
            { oId: "4", name: "Grind" },
            { oId: "5", name: "Bend" },
            { oId: "6", name: "Lathe" },
            { oId: "7", name: "Milling" },
            { oId: "8", name: "Routing" },
            { oId: "9", name: "Cutting" },
            { oId: "10", name: "Welding" },
            { oId: "11", name: "Cleaning" },
            { oId: "12", name: "Assembly" },
            { oId: "13", name: "Test" },
            { oId: "14", name: "Disassembly" },
            { oId: "15", name: "Wrapping" },
            { oId: "16", name: "other" },
        ]
    }),
    actions: {
        getOperationName(id) {
            return this.operations.find(o => o.oId === id).name
        }
    }
});