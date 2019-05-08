const express = require('express');
const Auth = require('../auth');
const services = require('./services');
const posts = require('./posts');
const upload = require('./upload');
const login = require('./login');
const logout = require('./logout');
const clients = require('./clients');
const features = require('./features');
const options = require('./options');
const getName = require('./getName');
const users = require('./users');
const partners = require('./partners');
const hero = require('./hero');
const core = require('./core');
const team = require('./teams');
const categories = require('./categories');
const about = require('./about');
const whyUs = require('./whyUs');
const portfolio = require('./portfolio');
const statistics = require('./statistics');
const contact = require('./contact');
const comments = require('./comments');
const reset = require('./resetPassword');
const privacy = require('./privacy');
const contactus = require('./contactus');
const newsletters = require('./newsletters');


const router = express.Router();
router
  .post('/resetPassword', reset.sendEmail)
  .post('/updatePassword', reset.updatePassword)
  .post('/login', login.post)
  .get('/logout', logout.get)
  .get('/hero/getAll', hero.get)
  .get('/getoptions', options.get)
  .get('/hero/:id', hero.getById)
  .get('/features/getAllHome', features.getAllHome)
  .get('/features/getAll', features.getAll)
  .get('/features/:id', features.getById)
  .get('/categories/getAll', categories.getAll)
  .get('/categories/get/:id', categories.getOne)
  .get('/posts/getAllPosts', posts.getAllPosts)
  .get('/postId/:seo', posts.getBySeo)
  .get('/serviceId/:seo', services.getBySeo)
  .get('/team/getAll', team.get)
  .get('/core', core.get)
  .get('/about', about.get)
  .get('/about/getItems', about.getItems)
  .get('/about/item/:id', about.getItem)
  .post('/about/item/:id', about.updateItem)
  .get('/portfolio', portfolio.get)
  .get('/portfolio/:id', portfolio.getById)
  .get('/whyUs/getAll', whyUs.getWhyus)
  .get('/getTitle', services.getTitle)
  .get('/statistics', statistics.get)
  .get('/services', services.get)
  .post('/contact', contact.post)
  .post('/comments/create', comments.post)
  .get('/contact/getAll', contact.get)
  .get('/getFile/:name', upload.get)
  .get('/clients/getAll', clients.getAll)
  .get('/privacy', privacy.get)
  .use(Auth.checkToken)
  .get('/contactus', contactus.get)
  .get('/newsletters', newsletters.get)
  .post('/privacy', privacy.update)
  .get('/posts/getAll', posts.getAll)
  .post('/about', about.update)
  .get('/core/:id', core.getCore)
  .post('/core', core.post)
  .delete('/core/delete', core.delete)
  .post('/core/updateCore', core.updateCore)
  .get('/getname', getName.get)
  .get('/profile', users.getProfile)
  .post('/profile', users.updateProfile)
  .post('/portfolio', portfolio.post)
  .post('/portfolio/update/:id', portfolio.update)
  .delete('/portfolio', portfolio.delete)

  .post('/services', services.post)
  .get('/comments/getAll', comments.get)
  .post('/comment/delete', comments.delete)
  .post('/comment/update', comments.update)
  .delete('/services/delete', services.delete)
  .get('/service/:id', services.getService)
  .get('/post/:id', posts.getPost)
  .post('/post/update/:id', posts.updatePost)
  .delete('/posts/delete', posts.delete)
  .post('/post/changeState', posts.changeState)
  .post('/post/create', posts.post)
  .get('/post/:id', posts.getPost)

  .post('/uploadFile', upload.post)
  .post('/uploadFav', upload.postIcon)
  .get('/getFav/:name', upload.getFav)
  .post('/features/updateHomepage', features.updateHomepage)
  .post('/removeFile', upload.remove)
  .post('/titles/update', services.update)
  .post('/services/updateService', services.updateServices)
  .post('/clients/add', clients.create)
  .get('/clients/get/:id', clients.getOne)
  .post('/clients/updateTitle', clients.updateTitle)
  .delete('/clients/delete', clients.delete)
  .post('/clients/update/:id', clients.update)
  .post('/features/create', features.post)
  .get('/features/get/:id', features.getOne)
  .delete('/features/delete/:id', features.delete)
  .post('/updateuser', users.updateUser)
  .post('/features/update/:id', features.update)
  .post('/partners/create', partners.post)
  .get('/partners/getAll', partners.getAll)
  .delete('/partners/delete/:id', partners.delete)
  .get('/partners/get/:id', partners.getOne)
  .post('/partners/update/:id', partners.update)
  .post('/hero/create', hero.post)
  .delete('/hero/delete/:id', hero.delete)
  .get('/hero/get/:id', hero.getOne)
  .post('/hero/update/:id', hero.update)
  .post('/team/create', team.post)
  .delete('/team/delete/:id', team.delete)
  .get('/team/get/:id', team.getOne)
  .post('/team/update/:id', team.update)
  .post('/categories/create', categories.post)
  .delete('/categories/delete/:id', categories.delete)
  .post('/categories/update/:id', categories.update)
  .post('/whyUs/update', whyUs.updateWhyus)
  .post('/statistics', statistics.post)
  .get('/statistics/:id', statistics.getById)
  .post('/statistics/:id', statistics.update)
  .delete('/statistics/:id', statistics.delete)
  .post('/contact/update', contact.update)

  .use(Auth.checkAdmin)
  .get('/users/getAll', users.get)
  .post('/users/create', users.post)
  .get('/user/:id', users.getUser)
  .delete('/users/delete', users.delete)
  .post('/option', options.update);

module.exports = router;
