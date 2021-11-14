interface Employee {
    uniqueId: number;
    name: string;
    subordinates: Employee[];
}

interface EmployeeOrgAppType extends Employee {
    getSubordinates: () => Employee[];
    moveSubordinate: (employeeId: number, supervisorId: number) => void;
    undo?: () => void;
    redo?: () => void;
}

class EmployeeOrgApp implements EmployeeOrgAppType {
    uniqueId: number;
    name: string;
    subordinates: Employee[];
    subordinatesUpdateHistory: Employee[][] = [];
    divElement: HTMLDivElement;

    constructor(ceo: Employee) {
        this.uniqueId = ceo.uniqueId;
        this.name = ceo.name;
        this.subordinates = ceo.subordinates;

        this.divElement = <HTMLDivElement>document.getElementById('main-div')
    }

    private describe() {
        // Simple visual display
        this.divElement.innerHTML = 
        `<h3>CEO Info: uniqueId: ${this.uniqueId} | Name: ${this.name}</h3>
        <h3>subordinates: ${JSON.stringify(this.subordinates)}</h1>
        `;
    }

    getSubordinates(): Employee[] {
        return this.subordinates;
    }

    set addSubordinates(sub: Employee[]) {
        this.subordinates = sub;
    }

    moveSubordinate(employeeIdToRemove: number, newSupervisorId: number) {
        let currentState: Employee[] = [...this.subordinates ],
            newState: Employee[] = [];

        // Create a fallback state
        this.subordinatesUpdateHistory.push(currentState);

        const EmployeeToMove = this.searchEmployee(employeeIdToRemove);
        const SupervisorToAssign = this.searchEmployee(newSupervisorId);
        if (EmployeeToMove && SupervisorToAssign) {
            currentState.forEach((emp, i) => {
                newState[i] = { ...emp, subordinates: [] }
                if (emp.uniqueId === newSupervisorId) {
                    newState[i].subordinates.push(EmployeeToMove)
                }
                newState[i].subordinates = this.subordinatesFiltered(emp.subordinates, EmployeeToMove, newSupervisorId)
            });
        } else {
            throw new Error(`Sorry, looks like you passed a wrong employee or supervisor id`);
        }
        this.subordinates = newState;

        this.describe();
    }

    undo() {
        if (this.subordinatesUpdateHistory.length) {
            const currentState = [...this.subordinates];
            const previousState = <Employee[]>this.subordinatesUpdateHistory.pop();
            this.subordinates = previousState;
            this.subordinatesUpdateHistory.push(currentState);
        } else {
            console.log('Sorry, there was no previous action history found.')
        }
        this.describe();
    }

    redo() {
        if (this.subordinatesUpdateHistory.length) {
            this.subordinates = <Employee[]>this.subordinatesUpdateHistory.pop();
        } else {
            console.log('Sorry, there was no previous action history found.')
        }
        this.describe();
    }

    private subordinatesFiltered(
        subOrdinates: Employee[],
        EmployeeToMove: Employee,
        newSupervisorId: number
    ): Employee[] {
        let resultArr: Employee[] = [];

        if (subOrdinates.length) {
            subOrdinates.forEach((subOrd, i) => {
                let subEmp: Employee = { ...subOrd, subordinates: [] }
                if (subOrd.uniqueId !== EmployeeToMove.uniqueId) {
                    subEmp.subordinates = this.subordinatesFiltered(
                        subOrd.subordinates,
                        EmployeeToMove,
                        newSupervisorId
                    )
                    resultArr[i] = subEmp;
                }
                if (subOrd.uniqueId === newSupervisorId) {
                    subEmp.subordinates.push(EmployeeToMove);
                    resultArr[i] = subEmp;
                }
            })
        }

        return resultArr;
    }

    private searchEmployee(employeeId: number): Employee | null {
        let emp: Employee | null = null;
        this.subordinates.forEach((subOrrd): any => {
            if (subOrrd && subOrrd?.uniqueId === employeeId) {
                emp = subOrrd;
            } else if (subOrrd.subordinates.length) {
                const SubEmp = this.findSubordinate(subOrrd.subordinates, employeeId)
                if (SubEmp?.uniqueId) emp = SubEmp;
            }
        });

        return emp;
    }


    private findSubordinate(allSubordinates: Employee[], subordinateToremoveId: number): Employee | null {
        let suboordinate: Employee | null = null;

        allSubordinates.forEach((emp) => {
            if (emp.uniqueId === subordinateToremoveId) {
                suboordinate = emp;
            } else if(emp.subordinates.length) {
                this.findSubordinate(emp.subordinates, subordinateToremoveId)
            }
        })
        return suboordinate;
    }
}

const subOrd = [{
    uniqueId: 10,
    name: 'Sarah Donald',
    subordinates: [
        { 
            uniqueId: 13,
            name: 'Cassandra Reynolds',
            subordinates: [
                {
                    uniqueId: 14,
                    name: 'Mary Blue',
                    subordinates: [{
                        uniqueId: 15,
                        name: 'Cassandra Reynolds',
                        subordinates: [{
                            uniqueId: 16,
                            name: 'Tina Teff',
                            subordinates: []
                        }]
                    }]
                }
            ]
        }
    ]},
    {
        uniqueId: 20,
        name: 'Tyler Simpson',
        subordinates: [
            {
                uniqueId: 21,
                name: 'Harry Tobs',
                subordinates: [
                    {
                        uniqueId: 22,
                        name: 'Thomas Brown',
                        subordinates: []
                    }
                ]
            },
            {
                uniqueId: 23,
                name: 'George Carrey',
                subordinates: []
            },
            {
                uniqueId: 24,
                name: 'Gary Styles:',
                subordinates: []
            }
        ]
    },
    {
        uniqueId: 25,
        name: 'Bruce Willis',
        subordinates: [],
    },
    {
        uniqueId: 26,
        name: 'Georgina Flangy',
        subordinates: [
            {
                uniqueId: 27,
                name: 'Sophie Turner',
                subordinates: []
            }
        ],
    },
]


const ceo1 = new EmployeeOrgApp({
    uniqueId: 1,
    name: 'Mark Zuckerberg',
    subordinates: subOrd
})

console.log(ceo1);
ceo1.moveSubordinate(21, 10)
ceo1.undo();
console.log(ceo1);
ceo1.redo();
console.log(ceo1);
ceo1.redo();
console.log(ceo1);

