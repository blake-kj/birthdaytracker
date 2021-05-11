class Birthday {
  constructor(firstName, lastName, dateOfBirth) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.dateOfBirth = new Date(dateOfBirth);
  }
  calculateAge() {
    const diff = Date.now() - this.dateOfBirth.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }
}

class UI {
  addBirthdayToList(birthday) {
    // select birthday list tbody element
    const list = document.querySelector("#birthday-list");
    // create tr element
    const row = document.createElement('tr');
    if(typeof birthday.dateOfBirth === 'string') {
      birthday.dateOfBirth = new Date(birthday.dateOfBirth);
    }
    // insert cols
    row.innerHTML = `
    <td>${birthday.firstName} ${birthday.lastName}</td>
    <td>${birthday.dateOfBirth.getUTCMonth()+1}-${birthday.dateOfBirth.getUTCDate()}-${birthday.dateOfBirth.getUTCFullYear()}</td>
    <td>${birthday.calculateAge()}</td>
    <td><i class="fas fa-minus-circle d-flex justify-content-end text-danger"></i></td>
    `;
    // append to list
    list.appendChild(row);
  }

  showAlert(message, className){
    // create div
    const div = document.createElement('div');
    // add classes
    div.className = `alert alert-${className}`;
    // add text
    div.appendChild(document.createTextNode(message));
    // get parent
    const card = document.querySelector('.card');
    // get form
    const form = document.querySelector('#birthday-form');
    // insert alert div
    card.insertBefore(div, form);
    // timeout after 3 seconds
    setTimeout(function(){
      document.querySelector('.alert').remove();
    }, 3000)
  }

  deleteBirthday(target) {
    if(target.classList.contains('fa-minus-circle')) {
      console.log('flag1');
      target.parentElement.parentElement.remove();
      // show deleted alert
      const ui = new UI;
      ui.showAlert('Birthday Deleted :)', 'danger');
    }
  }

  clearFields(){
    document.querySelector('#inputFirstName').value = '';
    document.querySelector('#inputLastName').value = '';
    document.querySelector('#inputDateOfBirth').value = '';
  }
}

class Store {
  static getBirthdays() {
    let birthdays;
    if(localStorage.getItem('birthdays') === null) {
      birthdays = [];
    } else {
      birthdays = JSON.parse(localStorage.getItem('birthdays'));
    }
    return birthdays;
  }

  static displayBirthdays() {
    const birthdays = Store.getBirthdays();
    birthdays.forEach(function(birthday){
      const ui = new UI;
      const birthdayObj = new Birthday;
      birthdayObj.firstName = birthday.firstName;
      birthdayObj.lastName = birthday.lastName;
      birthdayObj.dateOfBirth = birthday.dateOfBirth;
      ui.addBirthdayToList(birthdayObj);
    })
  }

  static addBirthday(birthday) {
    const birthdays = Store.getBirthdays();
    birthdays.push(birthday);
    localStorage.setItem('birthdays', JSON.stringify(birthdays));
  }

  static removeBirthday(dateOfBirth) {
    const birthdays = Store.getBirthdays();
    birthdays.forEach(function(birthday, index) {
      let birthdayObj = new Date(birthday.dateOfBirth);
      let birthdayString = `${birthdayObj.getUTCMonth()+1}-${birthdayObj.getUTCDate()}-${birthdayObj.getUTCFullYear()}`;
      console.log();
      if(birthdayString === dateOfBirth) {
        birthdays.splice(index, 1);
      }
    });
    localStorage.setItem('birthdays', JSON.stringify(birthdays));
  }


}

// DOM load event listener
document.addEventListener('DOMContentLoaded', Store.displayBirthdays());

// Event listener for submit birthday form
document.querySelector('#birthday-form').addEventListener('submit', function(e){
  // Get form values
  const firstName = document.querySelector('#inputFirstName').value,
        lastName = document.querySelector('#inputLastName').value,
        dateOfBirth = document.querySelector('#inputDateOfBirth').value;

  // Instantiating a Birthday:
  const birthday = new Birthday(firstName, lastName, dateOfBirth);

  // Instantiate UI:
  const ui = new UI();

  // Validate
  if (firstName === '' || lastName === '' || dateOfBirth === ''){
    // show error
  } else {
    // add book to list
    ui.addBirthdayToList(birthday);

    // add to local storage
    Store.addBirthday(birthday);
    // show success
    ui.showAlert('Birthday Added!', 'success');
    
    // clear fields
    ui.clearFields();
  }
  e.preventDefault();
});

// Event listener for delete birthday
document.querySelector('#birthday-list').addEventListener('click', function(e){
  // instantiate UI
  const ui = new UI();
  // delete book
  ui.deleteBirthday(e.target);
  //remove from local storage
  console.log(e.target.parentElement.previousElementSibling.previousElementSibling.textContent);
  Store.removeBirthday(e.target.parentElement.previousElementSibling.previousElementSibling.textContent);
  e.preventDefault();
})