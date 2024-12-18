import { getAllTasks, fetchOperations } from "@/firebase";

function getIntervals(taskIntervals){
    /*
    Taks intervals look like this:
    {
        start: 'some date || null',
        finish: 'some date || null',
        pause: [] or [ some date, some date ...]
    }
        They need to be transfered to
        {
            start: 'some date'
            end: 'some date from finish or every odd pause index value'
            label: 'task name or number',
            ganttBarConfig: {
                ... psecific data.
            }
        }
    */

}

export const getTasks = async () => {
    const rowsList = []
    const operations = await fetchOperations();
    const tasksList = await getAllTasks();
    for (const task of tasksList) {
        for (const op of operations) {  
            if(rowsList.find(row => row.label !== op.name)) {
                rowsList.pusn({'label': op.name, 'barsList': []})
            }
            if (task.operations[op.id].status !== 'notStarted') {
               const getObjIndex = rowsList.findIndex(row => row.label === op.name)
               rowsList[getObjIndex].barsList.push(
                {'label': task.number, 
                    'beginDate': task.operations[op.id].timestamp.start, 
                    'endDate': task.operations[op.id].timestamp.finish}
                )
               const intervals = task.operations[op.id].timestamp

               if (intervals.pause.length > 0){

               }

            }
        }
    }
    return rowsList;
}