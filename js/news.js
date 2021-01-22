var news_bar = document.getElementById("news-bar");

function h(element, props, ...children) {
  let el = document.createElement(element);

  if (props) {
    Object.keys(props).forEach(key => {
      el[key] = props[key];
    });
  }

  if (children) {
    el.append(...children);
  }

  return el;
}

window.addEventListener("load", function() {
  fetch('https://raw.githubusercontent.com/SorusClient/Sorus-Launcher/resources/json/news.json')
    .then(res => res.json())
    .then((out) => {
      console.log(out)
      for(let i = 0; i < out.length && i < 15; i++) {
        // news_bar.innerHTML += `
        //   <li>
        //     <img class="entry-thumbnail" src="${out[i].thumbnail}">
        //     <div class="entry-title">${out[i].title}</div>
        //     <div class="entry-content">
        //       ${out[i].content}
        //     </div>
        //     <div class="entry-footer">
        //       <img class="ef-pfp" src="https://crafatar.com/avatars/${out[i].uuid}" alt="">
        //       <div class="ef-name">Posted By <b>${out[i].author}</b></div>
        //       <div class="ef-date">${out[i].date}</div>
        //     </div>
        //   </li>
        // `
        let { thumbnail, title, content, uuid, author, date } = out[i];

        news_bar.appendChild(
          h('li', null,
            h('img', { className: 'entry-thumbnail', src: thumbnail }), 
            h('div', { className: 'entry-title' }, title),
            h('div', { className: 'entry-content' }, content),
            h('div', { className: 'entry-footer' },
              h('img', { className: 'ef-pfp', src: `https://crafatar.com/avatars/${uuid}`, alt: '' }),
              h('div', { className: 'ef-name' },
                'Posted By ',
                h('b', null, author)
              ),
              h('div', { className: 'ef-date' }, date)
            )
          )
        );
      }
    })
    .catch(console.error);
})