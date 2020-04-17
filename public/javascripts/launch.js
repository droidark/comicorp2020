const authors = {
    '06925015531546749535': {
        name: 'Erre Erregon',
        avatar: 'https://yt3.ggpht.com/a/AATXAJxxoUr5OqGoMLqJeqTNTG4P50s24DbRn510yA=s88-c-k-c0x00ffffff-no-rj',
        link: 'http://orgullogeekr.blogspot.com',
        about: 'Un pobre diablo que habla sobre películas que ve en el cine cuando el boleto le sale con descuento, en otras palabras: habla de Cine Barato.'
    },
    '16663121220987503262': {
        name: 'Fozz',
        avatar: 'https://pbs.twimg.com/profile_images/1234328437688610817/ABIndXV3_200x200.jpg',
        link: 'http://marvelmx.blogspot.com',
        about: 'Unico sobreviviente de este blog, desde 2009.'
    },
    '07861633488260418247': {
        name: 'Eduflas',
        avatar: 'https://pbs.twimg.com/profile_images/1031904202631467009/S_oXlr4E_200x200.jpg',
        link: 'https://twitter.com/eduflass',
        about: 'Elemento lento, torpe y débil que ocasionalmente escribe cosas sin sentido. No lo sigan.'
    }
};
const colors = [ 'blue', 'green', 'orange', 'pink', 'red', 'violet', 'yellow' ];

const util = {
    getAuthor: (author) => {
        if(authors[author.id] == undefined) {
            return {
                name: author.displayName,
                avatar: author.image.url,
                link: author.url,
                about: 'Nada que decir por el momento'
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
    latestPosts: () => {
        $.ajax({
            data: {
                maxResults: config.maxPosts,
                fields: config.latestPostsCallFields
            }
        }).done((data) => {
            for(let i = 0; i < config.maxPosts; i++) {
                post.title = data.items[i].title;
                post.link = data.items[i].url;
                post.date = util.getDate(data.items[i].published);
                post.thumb = util.getFirstImage(data.items[i].content);
                post.score = util.getScore(data.items[i].content);
                post.color = util.getColor(post.score);
                $.calendar = $('<i>', {class: 'fas fa-calendar mr-2'});
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
        });        
    },
    index: (page, type) => {
        let pp = 1, cp = 1, np = 2;
        let tokens = JSON.parse(sessionStorage.getItem('tokens'));
        const regex = /\/search\/label\/(.+[^\/])/g;
        const currentlocation = window.location.href ;
        const isLabel = regex.exec(currentlocation);
        cp = sessionStorage.getItem('currentPage');
        if(page > cp) {
            np = page + 1;
            pp = page > 2 ? (page - 1) : 1;
        } else if(page < cp) {
            np = cp;
            pp = page > 2 ? (page - 1) : 1;
        }
        let parameters = {
            maxResults: config.maxPosts,
            fields: config.indexCallFields
        };
        if(isLabel != null) {
            console.log(isLabel[1]);
            isLabel[1] = isLabel[1].replace('%20', ' ');
            console.log(isLabel[1]);
            parameters.labels = isLabel[1];
        }
        if(page > 1) {
            parameters.pageToken = tokens[page];
        }
        $.ajax({
            data: parameters
        }).done((data) => {
            $('#neon').empty();
            if(type == 'index' || page > cp) {
                tokens[np] = data.nextPageToken;                
            }
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
            }
            if(page == 1) {
                $('#previousPage').parent().addClass('disabled');
                $('#previousPage').attr({
                    'aria-disabled': true,
                    tabindex: -1
                }).removeClass('blue');
            } else {
                $('#previousPage').parent().removeClass('disabled');
                $('#previousPage').removeAttr('aria-disabled');
                $('#previousPage').removeAttr('tabindex');
                $('#previousPage').addClass('blue');
            }
            cp = page;
            sessionStorage.setItem('currentPage', cp);
            sessionStorage.setItem('tokens', JSON.stringify(tokens));
        });        
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
    maxPosts: 5,
    indexCallFields: 'nextPageToken,items(published,url,title,content,author,labels)',
    latestPostsCallFields: 'items(published,url,content,title)',
    singlePostCallFields: 'author,content',
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
    dataType: 'json',
    data: {
        key: config.apiKey,
    }
});

// START PROCESS
$(() => {
    // YEAR
    $('#year').text(new Date().getFullYear());
    // TOGGLETIPS
    $('[data-toggle="tooltip"]').tooltip();
    // NEWS BAR
    const agMarqueeBlock = $('.news');
    agMarqueeBlock.marquee(agMarqueeOptions);

    $('#LinkList1,#LinkList2').addClass('col-lg');

    const pageType = $('#pageType').val();
    const tokens = {1: '-'};
    sessionStorage.setItem('currentPage', 1);
    sessionStorage.setItem('tokens', JSON.stringify(tokens));
       

    // INDEX
    if(pageType == 'index') {
        // BUILD INDEX
        build.index(1, 'index');
        // LATESTS POSTS
        build.latestPosts();
        // NEXT PAGE
        $('#nextPage').on('click', (e) => {
            e.preventDefault();
            const nextPage = parseInt(sessionStorage.getItem('currentPage')) + 1;
            build.index(nextPage, 'next');
            $('html, body').animate({
                scrollTop: $('#neon').offset().top
            }, 2000);
        });

        // PREVIOUS PAGE
        $('#previousPage').on('click', (e) => {
            e.preventDefault();
            const previousPage = parseInt(sessionStorage.getItem('currentPage')) - 1;
            build.index(previousPage, 'previous');
            $('html, body').animate({
                scrollTop: $('#neon').offset().top
            }, 2000);
        });
    } else if(pageType == 'item') {
        const postId = $('#postId').val();
        // LATEST POST
        build.latestPosts();
        // AUTHOR INFORMATION
        $.ajax({
            url: config.resource + config.blogId + '/posts/' + postId,
            data: {
                fields: config.singlePostCallFields
            }
        }).done((data) => {
            post.author = util.getAuthor(data.author);
            $('#author-header a img').attr('src', post.author.avatar);
            $('#author-header a').attr({
                href: post.author.link, 
                'data-original-title': config.by + post.author.name})
                .append(config.by + post.author.name);
            $('#author-footer .card-header img').attr({
                src: post.author.avatar,
                alt: post.author.name});
            $('#author-footer .card-block a.card-title').attr({
                href: post.author.link}).append(post.author.name);
            $('#author-footer .card-block p.card-text').append(post.author.about);
            if($('#score').length) {
                post.score = util.getScore(data.content);
                post.color = util.getColor(post.score);
                $('#score').append(buildScore.complete(post.score, post.color));
            }
        });
    }
});