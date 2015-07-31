//jQuery for page scrolling feature - requires jQuery Easing plugin
// $(function() {
//     $('.page-scroll a').bind('click', function(event) {
//         var $anchor = $(this);
//         $('html, body').stop().animate({
//             scrollTop: $($anchor.attr('href')).offset().top
//         }, 1500, 'easeInOutExpo');
//         event.preventDefault();
//     });
// });

// A simple email model
var EmailModel = Backbone.Model.extend({
  defaults: { email: '' },
  validate: function (attributes, options) {
    if (!/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(attributes.email)) {
      return 'invalid_email';
    }
  }
});


// Create a Firebase.Collection and set the 'firebase' property
// to the URL of our database
var EmailCollection = Backbone.Firebase.Collection.extend({
  model: EmailModel,
  url: "https://majstry.firebaseio.com/contacts"
});


var App = Backbone.View.extend({
  el: $('#page-top'),
  events: {
    'click .page-scroll a': 'scrollNext',
    'submit #email_form': 'submitEmail',
    'click .js-submit': 'submitEmail'
  },

  initialize: function () {
    this.$form = this.$('#email_form');
    this.$inputGroup = this.$form.find('.input-group');
    this.$input = this.$form.find('input');


    this.$input.on('input', _.bind(function (event) {
        this.$inputGroup.removeClass('has-error');
    }, this));

    this.collection = new EmailCollection;
  },

  scrollNext: function (event) {
    event.preventDefault();
    var $anchor = $(event.currentTarget);
    $('html, body').stop().animate({
        scrollTop: $($anchor.attr('href')).offset().top
    }, 1500, 'easeInOutExpo');
  },

  submitEmail: function (event) {
    event.preventDefault();

    var model = new EmailModel({
      email: this.$input.val()
    })

    if (model.isValid()) {
      this.collection.create(model.toJSON());
      this.renderThanks();
    } else {
      this.renderError(model);
    }
  },

  renderThanks: function () {
    this.$('.newsletter-box').hide();
    this.$('.js-success-submit').show();
  },

  renderError: function (model) {
    this.$inputGroup.addClass('has-error');
  }
});

$(function () {
  window.app = new App;
})
