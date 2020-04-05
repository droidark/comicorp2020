$(function () {
    // YEAR
    $('#year').text(new Date().getFullYear());
    // TOGGLETIPS
    $('[data-toggle="tooltip"]').tooltip();
    // NEWS BAR
    const agMarqueeOptions = {
        duration: 20500,
        gap: 0,
        delayBeforeStart: 0,
        direction: 'left',
        duplicated: true,
        pauseOnHover: true,
        startVisible: true
    };
    const agMarqueeBlock = $('.news');
    agMarqueeBlock.marquee(agMarqueeOptions);

    $('#LinkList1,#LinkList2').addClass('col-lg');
});