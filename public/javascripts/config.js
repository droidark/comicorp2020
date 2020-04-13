export const config = {
    agMarqueeOptions: {
        duration: 20500,
        gap: 0,
        delayBeforeStart: 0,
        direction: 'left',
        duplicated: true,
        pauseOnHover: true,
        startVisible: true
    },
    author: {
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
    },
    colors: [
        'blue',
        'green',
        'orange',
        'pink',
        'red',
        'violet',
        'yellow'
    ],
    site: {
        blogUrl: 'https://comicorp.blogspot.com/',
        maxPosts: 5,
        afterText: '...',
        readMore: 'Leer M\u00E1s',
        publishBy: 'Publicado por ',
        by: 'por ',
        searchLabel: () => {
            return config.site.blogUrl + 'search/label/';
        },
        request: {
            resource: 'https://www.googleapis.com/blogger/v3/blogs/',
            blogId: '3232378657111313592',
            apiKey: 'AIzaSyB196dzzuDelvNzKTtteDF-Z4T-1pBDZbg',
            index: {
                fields: 'nextPageToken,items(published,url,title,content,author,labels)',
            }
        }
    }
}