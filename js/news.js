var news_bar = document.getElementById("news-bar");

window.addEventListener("load", function() {
    fetch('https://raw.githubusercontent.com/SorusClient/Sorus-Launcher/resources/json/news.json')
        .then(res => res.json())
        .then((out) => {
            console.log(out)
            var formattedNews = JSON.parse(JSON.stringify(out))
            for(var i = 0; i < 15; i++) {
                news_bar.innerHTML += `
                <li>
                    <img class="entry-thumbnail" src="${formattedNews[i].thumbnail}">
                    <div class="entry-title">${formattedNews[i].title}</div>
                    <div class="entry-content">
                        ${formattedNews[i].content}
                    </div>
                    <div class="entry-footer">
                        <img class="ef-pfp" src="https://crafatar.com/avatars/${formattedNews[i].uuid}" alt="">
                        <div class="ef-name">Posted By <b>${formattedNews[i].author}</b></div>
                        <div class="ef-date">${formattedNews[i].date}</div>
                    </div>
                </li>
                `
            }
        })
    .catch(err => console.error(err));
})