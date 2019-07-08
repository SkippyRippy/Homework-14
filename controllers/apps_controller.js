var Article = require('../models/Article.model');
var Comment = require('../models/Comment.model');
var cheerio = require('cheerio');
var request = require('request');

module.exports = function(app) {
    app.get('/', function(req, res) {
        res.render('home');
    });
    app.get('/index', function(req, res) {
        var articlesArray = [];

        request('https://www.reddit.com/r/news', function(err, res2, html) {
            var $ = cheerio.load(html);

            $('p.title').each(function(i, element) {
                var articleObj = {};
                articleObj.id = i;
                articleObj.title = $(this).text();
                articleObj.link = $(this).children().attr('href');
                articlesArray.push(articleObj);
            });
            res.render('index', { articles: articlesArray });
        });
    });

    app.post('/articles', function(req, res) {
        var savedArticle = req.body;
        Article.create(savedArticle, function(err, doc) {
            if (err) {
                console.log(err);
                res.redirect('/index');
            } else {
                res.redirect('/index');
            }
        });
    });

    app.get('/articles', function(req, res) {
        Article.find({})
            .populate('comments')
            .exec(function(err, articles) {
                if (err) {
                    res.send(err);
                } else {
                    var allSavedArticles = articles.map(function(article) {
                        return article;
                    });
                    res.render('articles', { articles: allSavedArticles });
                }
            });
    });

    app.post('/comments', function(req, res) {
        var comment = req.body;
        Article.findOne({
            title: comment.title
        }, function(err, article) {
            Comment.create({
                _article: article._id,
                text: comment.text
            }, function(err, doc) {
                article.comments.push(doc);
                article.save(function(err) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.redirect('/articles');
                    }
                });
            });
        });
    });

    app.delete('/comments', function(req, res) {
        var commentId = req.body.id;
        Comment.remove({ _id: commentId }, function(err, comment) {
            if (err) {
                res.send(err);
            } else {
                res.redirect('/articles');
            }
        });
    });
};