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
const buildStar = {
    build: (stars, farbe) => {
        let average, sum = 0, c = 0;
        $.postReview = $('<div>', {class: 'post-review'});
        $.overall = $('<div>', {class: 'overall-score ' + farbe});
        $.ul = $('<ul>');
        for (const prop in stars) {
            if(prop != 'color') {
                if(stars[prop] < 0) {
                    sum += 0;
                } else if (stars[prop] > 5) {
                    sum += 5;
                } else {
                    sum += stars[prop];
                }
                $.span = $('<span>', {class: 'score ' + farbe});
                for(let i = 0; i < 5; i++) {
                    clazz = i < stars[prop] ? 'fas fa-star' : 'far fa-star';
                    $.i = $('<i>', {class: clazz});
                    $.span.append($.i);
                }
                $.li = $('<li>', {text: prop});
                $.li.append($.span);
                $.ul.append($.li);
                c++;
            }
        }
        average = sum / c;
        for(let i = 0; i < 5; i++) {
            clazz = i < average ? 'fas fa-star' : 'far fa-star';
            $.i = $('<i>', {class: clazz});
            $.overall.append($.i);
        }
        $.postReview.append($.overall);
        $.postReview.append($.ul);
        return $.postReview;
    }
}
const util = {
    dateTransform: (date) => {
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
    formatText: (data, title) => {
        const length = 440;
        const regex = /(\r\n|\n|\r)/gm;
        let text = $(data).text();
        return text.length > 1 ?
            text
            .trim()
            .substring(0, length)
            .substring(0, text.lastIndexOf(' '))
            .replace(regex, ' ') : title;
    },
    getStars: (data) => {
        const c = $.parseHTML(data);
        const a = $(c).filter('#romdeau').attr('stars');
        if(a != undefined) {
            return JSON.parse(a);
        }
        return null;
    },
    buildPost: (post) => {
        const farbe = (post.stars == null || post.stars.color == null || post.stars.color == undefined) 
            ? colors[(Math.floor(Math.random() * 7))] 
            : post.stars.color;
            var x = null;
        if(post.stars != null) {
            x = buildStar.build(post.stars, farbe);
        }
        $.cardTitleLink = $('<a>', {href: post.link, text: post.title});
        $.cardTitle = $('<h2>', {class: 'card-title'}).append($.cardTitleLink);
        $.cardText = $('<p>', {class: 'card-text', text: post.text + config.afterText});
        $.readMore = $('<a>', {class: 'btn btn-outline-primary read-more', href: post.link, text: config.readMore});
        $.cardBody = $('<div>', {class: 'card-body'})
            .append($.cardTitle)
            .append(x)
            .append($.cardText)
            .append($.readMore);
        $.lineEffect = $('<span>', {class: 'line_effect bg-' + farbe});
        $.cardImage = $('<img>', {class: 'card-img-top', src: post.thumb, alt: post.title});
        $.cardLinkTop = $('<a>', {class: 'card-link-top', href: post.link})
            .append($.cardImage);
        $.card = $('<div>', {class: 'card'})
            .append($.cardLinkTop)
            .append($.lineEffect)
            .append($.cardBody);
        $('#neon').append($.card);
    },
    buildPostInfo: (post) => {
        $.postInfo = $('<div>', {class: 'post-pinfo'});
        $.userLink = $('<a>', {
            href: post.author.link,
            'data-original-title': config.publishBy + post.author.name,
            'data-toggle': 'tooltip'            
        });
        $.userImage = $('<img>', {src: post.author.avatar, alt: post.author.name});
        $.userLink.append($.userImage).append(config.by + post.author.name);
        $.labelLink = $('<a>', {href: config.searchLabel + post.labels[0], text: post.labels[0]})
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
    buildLatestPosts: (post) => {
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
    afterText: '...',
    readMore: 'Leer Más',
    publishBy: 'Publicado por ',
    by: 'por ',
    searchLabel: 'https://comicorp.blogspot.com/search/label/'
}
let post = {
    title: '',
    text: '',
    link: '',
    thumb: '',
    date: '',
    stars: {},
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
            maxResults: config.maxPosts
        }
    }).done(function(data) {
        for(let i = 0; i < config.maxPosts; i++) {
            post.title = data.items[i].title;
            post.link = data.items[i].url;
            post.date = util.dateTransform(data.items[i].published);
            post.thumb = util.getFirstImage(data.items[i].content);
            post.text = util.formatText(data.items[i].content, data.items[i].title);
            post.author = authors[data.items[i].author.id];
            post.stars = util.getStars(data.items[i].content);
            post.labels = data.items[i].labels;
            util.buildPost(post);
            util.buildPostInfo(post);
            if(i < 5) {
                util.buildLatestPosts(post);
            }
        }
    });
});