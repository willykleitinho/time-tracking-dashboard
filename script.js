const data = [
  {
    "title": "Work",
    "timeframes": {
      "daily": {
        "current": 5,
        "previous": 7
      },
      "weekly": {
        "current": 32,
        "previous": 36
      },
      "monthly": {
        "current": 103,
        "previous": 128
      }
    }
  },
  {
    "title": "Play",
    "timeframes": {
      "daily": {
        "current": 1,
        "previous": 2
      },
      "weekly": {
        "current": 10,
        "previous": 8
      },
      "monthly": {
        "current": 23,
        "previous": 29
      }
    }
  },
  {
    "title": "Study",
    "timeframes": {
      "daily": {
        "current": 0,
        "previous": 1
      },
      "weekly": {
        "current": 4,
        "previous": 7
      },
      "monthly": {
        "current": 13,
        "previous": 19
      }
    }
  },
  {
    "title": "Exercise",
    "timeframes": {
      "daily": {
        "current": 1,
        "previous": 1
      },
      "weekly": {
        "current": 4,
        "previous": 5
      },
      "monthly": {
        "current": 11,
        "previous": 18
      }
    }
  },
  {
    "title": "Social",
    "timeframes": {
      "daily": {
        "current": 1,
        "previous": 3
      },
      "weekly": {
        "current": 5,
        "previous": 10
      },
      "monthly": {
        "current": 21,
        "previous": 23
      }
    }
  },
  {
    "title": "Self Care",
    "timeframes": {
      "daily": {
        "current": 0,
        "previous": 1
      },
      "weekly": {
        "current": 2,
        "previous": 2
      },
      "monthly": {
        "current": 7,
        "previous": 11
      }
    }
  }
];

const messages = {
  daily: "Yesterday",
  weekly: "Last week",
  monthly: "Last month"
}

const activities = [];

const addDiv = document.createElement("div");
addDiv.classList.add("menu");
addDiv.innerHTML = `
  <h2></h2>
  <span class="close"><i class="fas fa-times"></i></span>
  <button class="plus-button"><i class="fas fa-plus"></i></button>
  <span class="value">0</span>
  <button class="minus-button"><i class="fas fa-minus"></i></button>
  <button class="confirm-button"><i class="fas fa-check"></i></button>
`;

const addValue = addDiv.querySelector(".value");

addDiv.querySelector(".plus-button").addEventListener("click", ev => {
  let value = Number(addValue.innerText);
  if (value != 10) {
    value += 1;
  }
  addValue.innerText = String(value);
});

addDiv.querySelector(".minus-button").addEventListener("click", ev => {
  let value = Number(addValue.innerText);
  if (value != 0) {
    value -= 1;
  }
  addValue.innerText = String(value);
});

addDiv.querySelector(".confirm-button").addEventListener('click', ev => {
  const value = Number(addValue.innerText);
  const title = addDiv.firstElementChild.innerText;
  const ac = activities.find(item => item.title == title);

  ac.updateCurrent(ac.view, value);
  ac.updateTimes(ac.view);
  addDiv.parentElement.removeChild(addDiv);
  addValue.innerText = "0";
});

addDiv.querySelector(".close").addEventListener('click', ev => {
  addValue.innerText = "0";
  addDiv.parentElement.removeChild(addDiv);
});

class Activity {
  constructor(category) {
    this.__title = category.title;
    this.__timeframes = category.timeframes;
    this.__view = "weekly";

    this.__element = document.createElement("article");
    this.__element.classList.add(this.__title.toLowerCase().replace(" ", "-"));
    this.__element.innerHTML = `
    <div>
      <h2>${ this.__title }</h2>
      <div class="svg">
        <svg width="21" height="5" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm8 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm8 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z" fill-rule="evenodd"/></svg>
      </div>
      <p class="current">${ this.__timeframes[this.__view].current }hrs</p>
      <p><span>${ messages[this.__view] }</span> - <span>${ this.__timeframes[this.__view].previous }hrs</span></p>
    </div>
    `;

    this.__currentElem = this.__element.querySelector(".current");
    this.__previousElem = this.__element.querySelector(".current + p");
  }

  get element() {
    return this.__element;
  }

  get title() {
    return this.__title;
  }
  
  get view() {
    return this.__view;
  }

  updateCurrent(view, value) {
    this.__timeframes.daily.current += value;
    this.__timeframes.weekly.current += value;
    this.__timeframes.monthly.current += value;
  }
  
  updateTimes(timeframe) {
    if (this.__view == timeframe) {
      this.__currentElem.innerText = `${ this.__timeframes[timeframe].current }hrs`;
      return;
    }

    if (timeframe != "daily" && timeframe != "weekly" && timeframe != "monthly")
      return;

    this.__view = timeframe;
    this.__currentElem.innerText = `${ this.__timeframes[timeframe].current }hrs`;
    this.__previousElem.innerHTML = `<span>${ messages[timeframe] }</span> - <span>${ this.__timeframes[timeframe].previous }hrs</span>`;
  }
}

window.onload = function() {
  const main = document.querySelector("main");
  
  data.forEach(category => {
    const ac = new Activity(category);
    activities.push(ac);
    main.appendChild(ac.element);
  });

  const timeframes = document.querySelectorAll("header ul a");
  for (let tm of timeframes) {
    tm.addEventListener("click", ev => {
      ev.preventDefault();
      const current = document.querySelector("a.selected");
      if (current) {
        current.classList.remove("selected");
      }
      ev.currentTarget.classList.add("selected");
      for (let ac of activities) {
        ac.updateTimes(ev.currentTarget.innerText.toLowerCase());
      }
    });
  }

  const ellipsis = document.getElementsByClassName("svg");
  for (let eli of ellipsis) {
    eli.addEventListener('click', ev => {
      const ac = activities.find(item => item.title == ev.currentTarget.parentElement.firstElementChild.innerText);
      
      addDiv.firstElementChild.innerText = ev.currentTarget.parentElement.firstElementChild.innerText;
      ev.currentTarget.parentElement.appendChild(addDiv);
    });
  }
}
