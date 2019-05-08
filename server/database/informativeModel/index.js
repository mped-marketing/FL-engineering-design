const options = require('./options');
const connection = require('../config');
const services = require('./services');
const features = require('./features');
const titles = require('./titles');
const categories = require('./categories');
const plans = require('./pricingPlans');
const posts = require('./posts');
const hero = require('./hero');
const users = require('./users');
const notifications = require('./notifications');
const clients = require('./clients');
const partners = require('./partners');
const team = require('./team');
const core = require('./core');
const about = require('./about');
const aboutItem = require('./aboutItem');
const whyus = require('./whyUs');
const portfolio = require('./portfolio');
const statistics = require('./statistics');
const comments = require('./comments');
const contact = require('./contact');
const privacy = require('./privacy');
const contactus = require('./contactus');
const newsletters = require('./newsletters');

aboutItem.belongsTo(about, {
  onDelete: 'CASCADE',
  foreignKey: 'about_id',
  targetKey: 'id',
});
portfolio.belongsTo(services, {
  onDelete: 'CASCADE',
  foreignKey: 'service_id',
  targetKey: 'id',
});
plans.belongsTo(categories, {
  onDelete: 'CASCADE',
  foreignKey: 'category_id',
  targetKey: 'id',
});
comments.belongsTo(posts, {
  onDelete: 'CASCADE',
  foreignKey: 'post_id',
  targetKey: 'id',
});
posts.belongsTo(users, {
  onDelete: 'CASCADE',
  foreignKey: 'auther_id',
  targetKey: 'id',
});
notifications.belongsTo(users, {
  onDelete: 'CASCADE',
  foreignKey: 'user_id',
  targetKey: 'id',
});
module.exports = {
  connection,
  services,
  notifications,
  features,
  titles,
  categories,
  plans,
  posts,
  hero,
  users,
  clients,
  options,
  partners,
  team,
  core,
  about,
  aboutItem,
  whyus,
  portfolio,
  statistics,
  comments,
  contact,
  privacy,
  contactus,
  newsletters,
};
