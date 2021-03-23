Page({
    data: {
        dataUrl: ""
    },
    onLoad: function (options) {

        this.article = this.selectComponent("#article");
        let url = "/timi/" + options.url + "?id=" + options.id;
        this.article.getData(url);
    }
})