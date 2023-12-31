const roublesWords = ['рубль', 'рубля', 'рублей'];
const kopeykiWords = ['копейка', 'копейки', 'копеек'];

function init() {
  const form = document.querySelector('.form');
  const button = document.querySelector('.form-button');
  const label = document.querySelector('.form-label');
  const input = document.querySelector('.form-input');
  return {
    result: {
      resultText: '',
      button: '',
    },
    uiState: {
      status: 'form', // result
      valid: true,
    },
    initialFrom: {
      form,
      button,
      label,
      input,
    },
  };
}

function render(state) {
  if (!state.uiState.valid) {
    state.initialFrom.label.textContent = 'Нужно ввести число';
    state.initialFrom.label.classList.add('red');
  }

  if (state.uiState.status === 'result') {
    const container = document.querySelector('.container');
    container.innerHTML = '';
    const divResult = document.createElement('div');
    divResult.classList.add('result-text');
    divResult.textContent = state.result.resultText;
    container.append(divResult);
    container.append(state.result.button);
  }
}

function intToWords(int, names) {
  const result = [];
  if (typeof int === 'number') {
    int = int.toString();
  } else if (typeof int !== 'string') {
    int = '';
  }
  if (
    !(names instanceof Array) ||
    typeof names[0] !== 'string' ||
    typeof names[1] !== 'string' ||
    typeof names[2] !== 'string'
  ) {
    names = null;
  }
  if (int.length && !/[^0-9]/.test(int)) {
    const selectName = function (number, names) {
      return names[
        parseInt(number) % 100 > 4 && parseInt(number) % 100 < 20
          ? 2
          : [2, 0, 1, 1, 1, 2][Math.min(parseInt(number) % 10, 5)]
      ];
    };
    let name = null;
    const zero = 'ноль';
    if (int === '0') {
      result.push(zero);
    } else {
      const from0To2 = [zero, 'одна', 'две'];
      const from0To19 = [
        zero,
        'один',
        'два',
        'три',
        'четыре',
        'пять',
        'шесть',
        'семь',
        'восемь',
        'девять',
        'десять',
        'одиннадцать',
        'двенадцать',
        'тринадцать',
        'четырнадцать',
        'пятнадцать',
        'шестнадцать',
        'семнадцать',
        'восемнадцать',
        'девятнадцать',
      ];
      const tens = [
        'десять',
        'двадцать',
        'тридцать',
        'сорок',
        'пятьдесят',
        'шестьдесят',
        'семьдесят',
        'восемьдесят',
        'девяносто',
      ];
      const hundreds = [
        'сто',
        'двести',
        'триста',
        'четыреста',
        'пятьсот',
        'шестьсот',
        'семьсот',
        'восемьсот',
        'девятьсот',
      ];
      const thousands = [
        ['тысяча', 'тысячи', 'тысяч'],
        ['миллион', 'миллиона', 'миллионов'],
        ['миллиард', 'миллиарда', 'миллиардов'],
        ['триллион', 'триллиона', 'триллионов'],
        ['квадриллион', 'квадриллиона', 'квадриллионов'],
        ['квинтиллион', 'квинтиллиона', 'квинтиллионов'],
        ['секстиллион', 'секстиллиона', 'секстиллионов'],
        ['септиллион', 'септиллиона', 'септиллионов'],
        ['октиллион', 'октиллиона', 'октиллионов'],
        ['нониллион', 'нониллиона', 'нониллионов'],
        ['дециллион', 'дециллиона', 'дециллионов'],
      ];
      const unknown = '{неизвестно}';
      const numberParts = int.replace(/(?=(\d{3})+(?!\d))/g, ' ').split(' ');
      let i = numberParts.length - 1;
      for (let j in numberParts) {
        let numberPart = parseInt(numberParts[j]);
        if (numberPart) {
          const numberPartResult = [];
          const hundred = Math.floor(numberPart / 100);
          if (hundred) {
            numberPartResult.push(hundreds[hundred - 1]);
            numberPart -= hundred * 100;
          }
          if (numberPart > 19) {
            const ten = Math.floor(numberPart / 10);
            numberPartResult.push(tens[ten - 1]);
            numberPart -= ten * 10;
          }
          if (numberPart) {
            numberPartResult.push(
              i === 1 && [1, 2].indexOf(numberPart) !== -1
                ? from0To2[numberPart]
                : from0To19[numberPart]
            );
          }
          if (thousands[i - 1] !== undefined) {
            numberPartResult.push(selectName(numberParts[j], thousands[i - 1]));
          } else if (i !== 0) {
            numberPartResult.push(unknown);
          } else if (names) {
            name = selectName(numberParts[j], names);
          }
          result.push(numberPartResult.join(' '));
        }
        i--;
      }
      if (!result.length) {
        result.push(zero);
      }
    }
    if (!name && names) {
      name = selectName(0, names);
    }
    if (name) {
      result.push(name);
    }
  }
  return result.join(' ');
}

function capitalize(text) {
  const firstLetter = text.slice(0, 1).toUpperCase();
  return `${firstLetter}${text.slice(1, text.length)}`;
}

function makeWordsFromValues(number) {
  const numberToString = Number(number).toFixed(2);
  const [roubles, kopeyki] = numberToString.split('.');
  const result = [];

  result.push(`${roubles},${kopeyki} руб. `);
  result.push(`(${capitalize(intToWords(roubles, roublesWords))}`);

  if (kopeyki === '00') {
    result.push(' 00 копеек');
  } else if (intToWords(kopeyki, kopeykiWords).slice(-11, -7) === 'два ') {
    result.push(` ${intToWords(kopeyki, kopeykiWords).replace('два', 'две')}`);
  } else {
    result.push(` ${intToWords(kopeyki, kopeykiWords)}`);
  }
  result.push(')');
  return result.join('');
}

function makeNDC(number) {
  const ndc = (number / 120) * 20;
  const ndcInwords = makeWordsFromValues(ndc);
  return `, в том числе НДС (20%) - ${ndcInwords}`;
}

const app = () => {
  const state = init();

  state.initialFrom.form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const number = formData.get('text').replace(',', '.');

    const ndc = makeNDC(number);
    const wordsFromValues = makeWordsFromValues(number);
    const result = `${wordsFromValues}${ndc}`;

    if (isNaN(number) || number === 0) {
      state.uiState.valid = false;
    } else {
      state.uiState.valid = true;
      state.uiState.status = 'result';
      state.result.resultText = result;

      const button = document.createElement('button');
      button.classList.add('button', 'refresh-button');
      button.textContent = 'Заново';

      button.addEventListener('click', () => {
        location.reload();
      });

      state.result.button = button;
    }
    render(state);
  });
};

app();
