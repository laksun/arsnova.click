# **DEPRECATED**

This project is deprecated in favor of arsnova.click v2.

Please submit issues and feature requests of arsnova.click here: [arsnova.click-v2](https://github.com/thm-projects/arsnova.click-v2)

You can fetch the latest updates from the [backend](https://github.com/thm-projects/arsnova.click-v2-backend) and [frontend](https://github.com/thm-projects/arsnova-click-v2-frontend) repos
or use the docker images: [Backend Docker](https://hub.docker.com/repository/docker/arsnova/arsnova-click-backend) and [Frontend Docker](https://hub.docker.com/repository/docker/arsnova/arsnova-click-frontend)

---


# Project Vision

[arsnova.click](http://arsnova.click) is a little bit [Kahoot!](https://getkahoot.com/) and a little bit [ARSnova](https://arsnova.eu/).

While Kahoot! is a small game-based audience-response app for schools, ARSnova is a full-grown innovative audience-response platform for colleges and universities. 

arsnova.click is somewhere in the feature range of both:

[![Landing Page](https://arsnova.thm.de/blog/wp-content/uploads/2016/03/arsnova_gamified.jpeg)](http://staging.arsnova.click)

* It is a free competition-based quiz webapp
* Everybody may create and play quizzes, as many as you like, at any time
* One landing page for both roles: quizmaster and candidate
* You don't have to register, sign-in, install an app, or pay for the service
* It offers a Markdown user interface for text formatting
* It offers LaTeX and syntax highlighting for questions and answer options, so that it is well appropriate for quizzes in maths, physics, and informatics
* It is Open Source under GNU General Public License version 3
* It is very responsive: from smartphone to widescreen, and very beamer-friendly
* It takes privacy to the extreme: no data is stored on a server, everything is in the [HTML5 WebStorage](http://www.w3schools.com/html/html5_webstorage.asp) of the quizmaster's browser
* It is at the peak of open-source web technology: [Meteor](https://www.meteor.com/) and [Bootstrap](http://getbootstrap.com/)

# Getting started

To run arsnova.click on your own Node.js-Server, at least a [MongoDB](https://docs.mongodb.org/manual/installation/) and [Meteor](https://www.meteor.com/) is needed. Furthermore, an HTTPS-Proxy-Server (for example Nginx) is highly recommended.

## Hardware Resources
Up to a amount of 100 users, we are recommending:

* 1 CPU-Core
* 1 GB of RAM
* 4 GB of free disk-space for the database

For 100+ users, we recommend:

* 2 CPU-Cores
* 2 GB of RAM
* 4 GB of free disk-space for the database

# Development

Our application uses Meteor as application framework. Download and install [Meteor](https://www.meteor.com/install) to get arsnova.click running on your local development environment.

You can start the app using the `meteor --settings settings.json` command in the main directory, the application will rebuild itself automatically on code changes.
Get additional informations through the official [Meteor Guide](http://guide.meteor.com/) and its [API-Documentation](http://docs.meteor.com/#/basic/).

For code-checking we use [jshint](http://jshint.com/).

# Code Inspection

We use [SonarQube](https://scm.thm.de/sonar/overview?id=de.thm.arsnova%3Aarsnova.click) to continuously check the quality and technical debts of our repo.

# Build & Deploy

We continuously integrate, sync with [GitHub](https://github.com/thm-projects/arsnova.click), and deploy to [staging](http://staging.arsnova.click) and [production](http://arsnova.click) evironments with [GitLab CI](https://git.thm.de/arsnova/arsnova.click/builds).

[![build status](https://git.thm.de/arsnova/arsnova.click/badges/staging/build.svg)](https://git.thm.de/arsnova/arsnova.click/commits/staging)
