import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
require('flatpickr/dist/themes/confetti.css');
import Notiflix from 'notiflix';

const inputRef = document.querySelector('input[type="text"]');
const startBtn = document.querySelector('button[data-start]');

inputRef.classList.add('timer-input');
startBtn.classList.add('timer-btn');

startBtn.disabled = true;

let refs = {
  days: document.querySelector('span[data-days]'),
  hours: document.querySelector('span[data-hours]'),
  mins: document.querySelector('span[data-minutes]'),
  secs: document.querySelector('span[data-seconds]'),
};

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    let currentDate = new Date();
    let timerId = null;

    if (selectedDates[0] <= currentDate) {
      startBtn.disabled = true;
      Notiflix.Notify.info('Please choose a date in the future');
      return;
    }

    startBtn.disabled = false;

    startBtn.addEventListener('click', () => {
      timerId = setInterval(() => {
        currentDate = new Date();

        let deltaTime = selectedDates[0] - currentDate;

        if (currentDate.toString() === selectedDates[0].toString()) {
          clearInterval(timerId);
          startBtn.disabled = true;
          return;
        }

        startBtn.disabled = true;

        let { days, hours, minutes, seconds } = convertMs(deltaTime);

        refs.days.textContent = `${days}`;
        refs.hours.textContent = `${hours}`;
        refs.mins.textContent = `${minutes}`;
        refs.secs.textContent = `${seconds}`;
      }, 1000);
    });
  },
};

flatpickr(inputRef, options);

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = addLeadingZero(Math.floor(ms / day));
  // Remaining hours
  const hours = addLeadingZero(Math.floor((ms % day) / hour));
  // Remaining minutes
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  // Remaining seconds
  const seconds = addLeadingZero(Math.floor((((ms % day) % hour) % minute) / second));

  return { days, hours, minutes, seconds };
}
