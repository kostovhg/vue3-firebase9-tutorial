import { defineStore } from "pinia";

export const useOpsStore = defineStore("operations", {
    state: () => ({
        operations: [
            { oId: "1", name: "Documents", bgName: "Доцументи"},
            { oId: "2", name: "Supply", bgName: "Доставка" },
            { oId: "3", name: "Laser", bgName: "Лазер" },
            { oId: "4", name: "Grind", bgName: "Шлайф" },
            { oId: "5", name: "Bend", bgName: "Абкант" },
            { oId: "6", name: "Lathe", bgName: "Струг" },
            { oId: "7", name: "Milling", bgName: "Фреза" },
            { oId: "8", name: "Routing", bgName: "Рутер" },
            { oId: "9", name: "Cutting", bgName: "Лентоотрезна" },
            { oId: "10", name: "Welding", bgName: "Заваряване" },
            { oId: "11", name: "Cleaning", bgName: "Почистване" },
            { oId: "12", name: "Assembly", bgName: "Сглобяване" },
            { oId: "13", name: "Test", bgName: "Тест" },
            { oId: "14", name: "Disassembly" , bgName: "Разглобяване"},
            { oId: "15", name: "Wrapping", bgName: "Опаковка" },
            { oId: "16", name: "other", bgName: "Други" },
        ]
    }),
    actions: {
        getOperationName(id) {
            return this.operations.find(o => o.oId === id).name
        }
    }
});