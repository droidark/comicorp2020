const authors = {
    '06925015531546749535': {
        name: 'Erre Erregon',
        avatar: 'https://yt3.ggpht.com/a/AATXAJxxoUr5OqGoMLqJeqTNTG4P50s24DbRn510yA=s88-c-k-c0x00ffffff-no-rj',
        link: 'http://orgullogeekr.blogspot.com'
    },
    '16663121220987503262': {
        name: 'Fozz',
        avatar: 'https://pbs.twimg.com/profile_images/1234328437688610817/ABIndXV3_200x200.jpg',
        link: 'http://marvelmx.blogspot.com'
    },
    '07861633488260418247': {
        name: 'Eduflas',
        avatar: 'https://pbs.twimg.com/profile_images/1031904202631467009/S_oXlr4E_200x200.jpg',
        link: 'https://twitter.com/eduflass'
    }
};
const colors = [ 'blue', 'green', 'orange', 'pink', 'red', 'violet', 'yellow' ];

const util = {
    getAuthor: (author) => {
        if(authors[author.id] == undefined) {
            return {
                name: author.displayName,
                avatar: author.image.url,
                link: author.url
            }
        }
        return authors[author.id];
    },
    getColor: (score) => {
        return score == null
            ? colors[(Math.floor(Math.random() * 7))]
            : score.color == null 
                ? colors[(Math.floor(Math.random() * 7))]
                : colors.find(e => e == score.color) != undefined
                    ? score.color
                    : colors[(Math.floor(Math.random() * 7))];
    },
    getDate: (date) => {
        const d = new Date(date);
        const ye = new Intl.DateTimeFormat('mx-ES', { year: 'numeric' }).format(d)
        const mo = new Intl.DateTimeFormat('mx-ES', { month: 'short' }).format(d)
        const da = new Intl.DateTimeFormat('mx-ES', { day: '2-digit' }).format(d)
        return da + ' ' + mo + ' ' + ye;
    },
    getFirstImage: (data) => {
        let m, c = 0;
        let img = '';
        rex = /<i[mg|frame][^>]+src="?([^"\s]+\.[jpg|png|gif]+)"?[^>]*>/g; 
        do {
            m = rex.exec(data);  
            img = m[1];
            c++;
        }
        while ( c < 0);
        return img;
    },
    getScore: (data) => {
        const min = 0, max = 5;
        const c = $.parseHTML(data);
        const a = $(c).filter('#score').attr('score');
        if(a != undefined) {
            let score = JSON.parse(a);
            score['average'] = 0;
            for (const criteria in score) {
                if(criteria != 'color' && criteria != 'average') {
                    if(score[criteria] < min) {
                        score['average'] += min;
                    } else if(score[criteria] > max) {
                        score['average'] += max;
                    } else {
                        score['average'] += score[criteria];
                    }
                }
            }
            score['average'] = Math.floor(score['average'] / ((Object.keys(score).length) - 2));
            return score;
        }
        return null;
    },
    getText: (data, title) => {
        const length = 500;
        const regex = /(\r\n|\n|\r)/gm;
        let text = $(data).text();
        if(text.length > 1) {
            text = text.trim()
                .replace(regex, ' ')
                .substring(0, length)
                .trim();
            return text.substring(0, text.lastIndexOf(' '));
        }
        return title;
    }
};

const buildScore = {
    complete: (score, farbe) => {
        const max = 5;
        let clase = '';
        $.postReview = $('<div>', {class: 'post-review'});
        $.overall = $('<div>', {class: 'overall-score ' + farbe});
        $.ul = $('<ul>');
        for (const criteria in score) {
            if(criteria != 'color' && criteria != 'average') {
                $.span = $('<span>', {class: 'score ' + farbe});
                for(let i = 0; i < max; i++) {
                    clase = i < score[criteria] ? 'fas fa-star' : 'far fa-star';
                    $.i = $('<i>', {class: clase});
                    $.span.append($.i);
                }
                $.li = $('<li>', {text: criteria});
                $.li.append($.span);
                $.ul.append($.li);                
            }
        }
        $.postReview
            .append(buildScore.simple(score['average'], 'overall-score', farbe))
            .append($.ul);
        return $.postReview;
    },
    simple: (average, classes, farbe) => {
        const max = 5;
        let clase = '';
        $.container = $('<div>', {class: classes + ' ' + farbe});
        for(let i = 0; i < max; i++) {
            clase = i < average ? 'fas fa-star' : 'far fa-star';
            $.i = $('<i>', {class: clase});
            $.container.append($.i);
        }
        return $.container;
    }
}

const build = {
    post: (post) => {
        $.cardTitleLink = $('<a>', {href: post.link, text: post.title});
        $.cardTitle = $('<h2>', {class: 'card-title'}).append($.cardTitleLink);
        $.cardText = $('<p>', {class: 'card-text', text: post.text + config.afterText});
        $.readMore = $('<a>', {class: 'btn btn-outline-primary read-more', href: post.link, text: config.readMore});
        $.cardBody = $('<div>', {class: 'card-body'}).append($.cardTitle);
        if(post.score != null) {
            $.cardBody.append(buildScore.complete(post.score, post.color));
        }
        $.cardBody
            .append($.cardText)
            .append($.readMore);
        $.lineEffect = $('<span>', {class: 'line_effect bg-' + post.color});
        $.cardImage = $('<img>', {class: 'card-img-top', src: post.thumb, alt: post.title});
        $.cardLinkTop = $('<a>', {class: 'card-link-top', href: post.link})
            .append($.cardImage);
        $.card = $('<div>', {class: 'card'})
            .append($.cardLinkTop)
            .append($.lineEffect)
            .append($.cardBody);
        $('#neon').append($.card);
    },
    postInfo: (post) => {
        $.postInfo = $('<div>', {class: 'post-pinfo'});
        $.userLink = $('<a>', {
            href: post.author.link,
            'data-original-title': config.publishBy + post.author.name,
            'data-toggle': 'tooltip'            
        });
        $.userImage = $('<img>', {src: post.author.avatar, alt: post.author.name});
        $.userLink
            .append($.userImage)
            .append(config.by + post.author.name);
        $.labelLink = $('<a>', {href: config.searchLabel() + post.labels[0], text: post.labels[0]})
        $.postInfo
            .append($.userLink)
            .append($('<i>', {text: '|'}))
            .append($.labelLink)
            .append($('<i>', {text: '|'}))
            .append('0 Comments')
            .append($('<i>', {text: '|'}))
            .append(post.date);
        $('#neon').append($.postInfo);
    },
    latestPosts: (post) => {
        console.log(post);
        $.calendar = $('<i>', {class: 'fas fa-calendar'});
        $.cardText = $('<small>', {class: 'card-text text-white'})
            .append($.calendar)
            .append(post.date);
        $.link = $('<a>', {href: post.link, text: post.title});
        $.cardTitle = $('<h5>', {class: 'card-title'})
            .append($.link);
        $.cardImgOverlay = $('<div>', {class: 'card-img-overlay'})
            .append($.cardText)
            .append($.cardTitle);
            if(post.score != null) {
                $.cardImgOverlay.append(buildScore.simple(post.score.average, 'card-text', post.color));
            }
        $.cardImg = $('<img>', {class: 'card-img', src: post.thumb, alt: post.title});
        $.card = $('<div>', {class: 'card rounded-0'})
            .append($.cardImg)
            .append($.cardImgOverlay);
        $('#latestsPosts').append($.card);
    }
}
const agMarqueeOptions = {
    duration: 20500,
    gap: 0,
    delayBeforeStart: 0,
    direction: 'left',
    duplicated: true,
    pauseOnHover: true,
    startVisible: true
};
const config = {
    resource: 'https://www.googleapis.com/blogger/v3/blogs/',
    blogId: '3232378657111313592',
    blogUrl: 'https://comicorp.blogspot.com/',
    apiKey: 'AIzaSyB196dzzuDelvNzKTtteDF-Z4T-1pBDZbg',
    maxPosts: 7,
    fields: 'nextPageToken,items(published,url,title,content,author,labels)',
    afterText: '...',
    readMore: 'Leer M\u00E1s',
    publishBy: 'Publicado por ',
    by: 'por ',
    searchLabel: () => {
       return config.blogUrl + 'search/label/';
    }
}
let post = {
    title: '',
    text: '',
    link: '',
    thumb: '',
    date: '',
    color: '',
    score: {},
    author: {},
    labels: []
}

$.ajaxSetup({
    url: config.resource + config.blogId + '/posts',
    dataType: 'json'
});
$(function () {
    // YEAR
    $('#year').text(new Date().getFullYear());
    // TOGGLETIPS
    $('[data-toggle="tooltip"]').tooltip();
    // NEWS BAR
    const agMarqueeBlock = $('.news');
    agMarqueeBlock.marquee(agMarqueeOptions);

    $('#LinkList1,#LinkList2').addClass('col-lg');

    // AJAX CALL
    $.ajax({
        data: {
            key: config.apiKey,
            maxResults: config.maxPosts,
            fields: config.fields
        }
    }).done(function(data) {
        for(let i = 0; i < config.maxPosts; i++) {
            post.title = data.items[i].title;
            post.link = data.items[i].url;
            post.date = util.getDate(data.items[i].published);
            post.thumb = util.getFirstImage(data.items[i].content);
            post.text = util.getText(data.items[i].content, data.items[i].title);
            post.author = util.getAuthor(data.items[i].author);
            post.score = util.getScore(data.items[i].content);
            post.color = util.getColor(post.score);
            post.labels = data.items[i].labels;            
            build.post(post);
            build.postInfo(post);
            if(i < 5) {
                build.latestPosts(post);
            }
        }
    });
});