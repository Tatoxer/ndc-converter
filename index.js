const form = document.querySelector('.form');
const button = document.querySelector('.form-button');
const label = document.querySelector('.form-label');
const input = document.querySelector('.form-input');
const resultText = document.querySelector('.result-text');

const calculateNDC = (form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const number = Number(formData.get('number'));
    if (isNaN(number)) {
      label.textContent = 'Нужно ввести число';
      label.classList.add('red');
    }

    button.classList.add('hidden');
    label.classList.add('hidden');
    input.classList.add('hidden');
    resultText.classList.remove('hidden');

    resultText.textContent = number;
  });
};

calculateNDC(form);
