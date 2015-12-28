var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');

router.get('/posts', function(req,res,next){
	Post.find(function(err,posts){
		if(err){
			return next(err);
		}
		res.json(posts);
	})
})

router.post('/posts', function(req,res,next){
	console.log(req.body.title);
	console.log(req.body.body);
	var post = new Post(req.body);

	post.save(function(err,post){
		if(err){
			return next(err);
		}
		res.json(post);
	});

});

router.param('post', function(req,res,next,id){
	console.log("Finding a post");
	var query = Post.findById(id);

	query.exec(function(err,post){
		if(err){
			console.log("Error in finding the post");
			return next(err);
		}
		if(!post){
			console.log("Can't find the post.")
			return next(new Error('can\'t find the post'));
		}
		console.log("Copying the post to the request object");
		req.post = post;
		return next();
	})
})

router.get('/posts/:post', function(req,res,next){
	res.json(req.post);

});

router.post('/posts/:post/save', function(req,res,next){
	req.post.title = req.body.title;
	req.post.body = req.body.body;
	req.post.date = Date.now();

	req.post.save(function(err,post){
		if(err){
			return next(err);
		}
		res.json(req.post);
	});

});

router.post('/posts/:post/delete', function(req,res,next){
	req.post.remove(function(err,post){
        if(!err){
            Post.find(function(err,posts){
            if(err){return next(err);}
            res.json(posts);
            });
        }
    })
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
