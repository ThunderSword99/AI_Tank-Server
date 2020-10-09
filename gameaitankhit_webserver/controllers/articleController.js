const Article = require('../models/article');

exports.list = (req, res) => {
    Article.find({}).populate('creator').exec()
        .then(article => {
            let user = {
                role: req.user.role,
                name: req.user.firstName
            }
            res.render('admin/article/article', { user: user, data: article });
        })
        .catch(err => {
            res.send(err + '');
        })
}

exports.edit_get = (req, res) => {
    Article.findById(req.params.id).lean()
        .then(article => {
            article.csrfToken = req.csrfToken();
            res.json(article);
        })
        .catch(err => {
            res.json();
        })
}

exports.edit_post = (req, res) => {
    Article.findById(req.body.id).exec()
        .then(async article => {
            article.title = req.body.title;
            article.content = req.body.content;
            article.modifiedTime = Date.now();
            await article.save();
            res.redirect('/admin/article');
        })
        .catch(err => {
            res.send(err + '');
        })
}

exports.add_get = async (req, res) => {
    let article = {
        csrfToken: req.csrfToken()
    }
    res.json(article);
}

exports.add_post = (req, res) => {
    let article = new Article({
        title: req.body.title,
        content: req.body.content,
        creator: req.user.id,
        createTime: Date.now(),
        modifiedTime: Date.now()
    });
    article.save()
        .then(result => {
            console.log(result);
            res.redirect('/admin/article');
        })
        .catch(err => {
            res.send(err + '');
        })
}

exports.delete_get = (req, res) => {
    let article = {
        csrfToken: req.csrfToken()
    }
    res.json(article);
}

exports.delete_post = (req, res) => {
    Article.findByIdAndRemove(req.body.id).exec()
        .then(result => {
            res.redirect('/admin/article');
        })
        .catch(err => {
            res.send(err + '');
        })

}
