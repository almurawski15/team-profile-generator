// External packages
const inquirer = require('inquirer');
const fs = require('fs');

// Internal modules
const Manager = require('./lib/manager');
const Engineer = require('./lib/engineer');
const Intern = require('./lib/intern');

const questions = require('./questions');
const render = require('./lib/htmlRenderer');

// Array to contain all employee objects to render HTML
const employees = [];

// Function to create a manager object
async function createManager() {
    let managerResponses = await inquirer.prompt(questions.manager);

    // Create new object from class and add to employee array
    let newManager = new Manager
        (managerResponses.mgrName,
        managerResponses.mgrId,
        managerResponses.mgrEmail,
        managerResponses.mgrOffice);

    employees.push(newManager);

    console.log("Thanks! We've added a new manager to the team: ", newManager);
};


// Function to ask if they'd like to create a new team member
async function confirmEmployee() {

    let confirmEmployee = await inquirer.prompt(questions.create);

    switch (confirmEmployee.confirmEmp) {
        case false:
            console.log("Thank you for your input so far. Here are your team members: ", employees);
            console.log('Generating your HTML page next...');
            return;

        case true:
            await createEmployee();
    };
};


// Function to create Engineer or Intern
async function createEmployee() {

    let employeeRole = await inquirer.prompt(questions.employee);

    switch (employeeRole.empRole) {
        case 'Engineer':
            let engResponses = await inquirer.prompt(questions.engineer);
            let newEngineer = new Engineer
                (engResponses.engName,
                    engResponses.engId,
                    engResponses.engEmail,
                    engResponses.engGithub);
            employees.push(newEngineer);
            console.log("Thanks! We've added a new engineer to the team: ", newEngineer);
            await confirmEmployee();
            break;
        case 'Intern':
            let internResponses = await inquirer.prompt(questions.intern);
            let newIntern = new Intern
                (internResponses.internName,
                    internResponses.internId,
                    internResponses.internEmail,
                    internResponses.internSchool);
            employees.push(newIntern);
            console.log("Thanks! We've added a new intern to the team: ", newIntern);
            await confirmEmployee();
    };

};

async function init() {
    try {
        await createManager();

        await confirmEmployee();

    } catch (error) {
        console.log(error);
    };

    try {
        fs.writeFileSync('./docs/index.html', renderedHTML);

        console.log('Success! Your HTML page has been generated in the docs folder.')

    } catch (error) {
        console.log(error);
    }

};

init();
