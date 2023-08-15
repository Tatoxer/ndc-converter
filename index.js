const form = document.querySelector('.form');
const button = document.querySelector('button');

const getFormData = (form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const number = Number(formData.get('number'));
    if (isNaN(number)) {
      // button.textContent('Нужно ввести число');
      console.log(button);
    }
    return number;
  });
};

getFormData(form);
