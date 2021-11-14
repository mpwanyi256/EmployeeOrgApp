"use strict";
class EmployeeOrgApp {
    constructor(ceo) {
        this.subordinatesUpdateHistory = [];
        this.uniqueId = ceo.uniqueId;
        this.name = ceo.name;
        this.subordinates = ceo.subordinates;
    }
    getSubordinates() {
        return this.subordinates;
    }
    set addSubordinates(sub) {
        this.subordinates = sub;
    }
    moveSubordinate(employeeIdToRemove, newSupervisorId) {
        let currentState = [...this.subordinates], newState = [];
        this.subordinatesUpdateHistory.push(currentState);
        const EmployeeToMove = this.searchEmployee(employeeIdToRemove);
        const SupervisorToAssign = this.searchEmployee(newSupervisorId);
        if (EmployeeToMove && SupervisorToAssign) {
            currentState.forEach((emp, i) => {
                newState[i] = Object.assign(Object.assign({}, emp), { subordinates: [] });
                if (emp.uniqueId === newSupervisorId) {
                    newState[i].subordinates.push(EmployeeToMove);
                }
                newState[i].subordinates = this.subordinatesFiltered(emp.subordinates, EmployeeToMove, newSupervisorId);
            });
        }
        else {
            throw new Error(`Sorry, looks like you passed a wrong employee or supervisor id`);
        }
        this.subordinates = newState;
    }
    undo() {
        if (this.subordinatesUpdateHistory.length) {
            const currentState = [...this.subordinates];
            const previousState = this.subordinatesUpdateHistory.pop();
            this.subordinates = previousState;
            this.subordinatesUpdateHistory.push(currentState);
        }
        else {
            console.log('Sorry, there was no previous action history found.');
        }
    }
    redo() {
        if (this.subordinatesUpdateHistory.length) {
            this.subordinates = this.subordinatesUpdateHistory.pop();
        }
        else {
            console.log('Sorry, there was no previous action history found.');
        }
    }
    subordinatesFiltered(subOrdinates, EmployeeToMove, newSupervisorId) {
        let resultArr = [];
        if (subOrdinates.length) {
            subOrdinates.forEach((subOrd, i) => {
                let subEmp = Object.assign(Object.assign({}, subOrd), { subordinates: [] });
                if (subOrd.uniqueId !== EmployeeToMove.uniqueId) {
                    subEmp.subordinates = this.subordinatesFiltered(subOrd.subordinates, EmployeeToMove, newSupervisorId);
                    resultArr[i] = subEmp;
                }
                if (subOrd.uniqueId === newSupervisorId) {
                    subEmp.subordinates.push(EmployeeToMove);
                    resultArr[i] = subEmp;
                }
            });
        }
        return resultArr;
    }
    searchEmployee(employeeId) {
        let emp = null;
        this.subordinates.forEach((subOrrd) => {
            if (subOrrd && (subOrrd === null || subOrrd === void 0 ? void 0 : subOrrd.uniqueId) === employeeId) {
                emp = subOrrd;
            }
            else if (subOrrd.subordinates.length) {
                const SubEmp = this.findSubordinate(subOrrd.subordinates, employeeId);
                if (SubEmp === null || SubEmp === void 0 ? void 0 : SubEmp.uniqueId)
                    emp = SubEmp;
            }
        });
        return emp;
    }
    findSubordinate(allSubordinates, subordinateToremoveId) {
        let suboordinate = null;
        allSubordinates.forEach((emp) => {
            if (emp.uniqueId === subordinateToremoveId) {
                suboordinate = emp;
            }
            else if (emp.subordinates.length) {
                this.findSubordinate(emp.subordinates, subordinateToremoveId);
            }
        });
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
        ]
    },
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
];
const ceo1 = new EmployeeOrgApp({
    uniqueId: 1,
    name: 'Mark Zuckerberg',
    subordinates: subOrd
});
console.log(ceo1);
ceo1.moveSubordinate(21, 10);
ceo1.undo();
console.log(ceo1);
ceo1.redo();
console.log(ceo1);
ceo1.redo();
console.log(ceo1);
