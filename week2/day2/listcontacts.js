const readline = require('readline');
const EventEmitter = require('events');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const Myevent = new EventEmitter();
const contacts = [];

Myevent.on('add', (name, number) => {
  contacts.push({ name, number });
  console.log(`Name: ${name}, Phone: ${number}`);
});

Myevent.on('find', (name) => {
  const existContact = contacts.find(contact => contact.name.toLowerCase() === name.toLowerCase());
  if (existContact) {
    console.log(`Name: ${existContact.name}, Phone: ${existContact.number}`);
  } else {
    console.log("Contact not found");
  }
});

Myevent.on('display', () => {
  if (contacts.length === 0) {
    console.log("No contacts available.");
  } else {
    console.log("Contact list : ");
    contacts.forEach((contact) => {
      console.log(`Nome: ${contact.name} Phone: ${contact.number}`);
    });
  }
});

async function prompt(question) {
  return new Promise((resolve, reject) => {
    rl.question(question, (userInput) => {
      resolve(userInput);
    });
  });
}

( async () => {
  while (true) {
    console.log('\nMenu:');
    console.log('1. Add a contact');
    console.log('2. View all contacts');
    console.log('3. Search for a contact');
    console.log('4. Exit');

    const choice = await prompt('Enter your choice : ');

    switch (choice) {
      case '1':
        const name = await prompt("Enter your name: ");
        const phone = await prompt("Enter your phone: ");
        Myevent.emit('add', name, phone);
        break;
      case '2':
        Myevent.emit('display');
        break;
      case '3':
        const searchName = await prompt("Enter name to search: ");
        Myevent.emit('find', searchName);
        break;
      case '4':
        rl.close();
        return;
      default:
        console.log('Invalid choice. Please try again.');
    }
  }
})();
