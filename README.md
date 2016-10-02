# hotelshub
treebo hotels full stack developer hackerearth challenge

This api is currently hosted on Heroku and database is hosted on mlab, for further testing use the following url:

[HotelsHub](https://hotelshub.herokuapp.com/)

### Routes are as follows

1. Get complete list
   * https://hotelshub.herokuapp.com/list
2. Get list with pagination/filters
   * https://hotelshub.herokuapp.com/list?page=2
   * https://hotelshub.herokuapp.com/list?sortBy=price
   * https://hotelshub.herokuapp.com/list?page=3&sortBy=rating
3. Get stats
   * https://hotelshub.herokuapp.com/stats
4. Search
   * https://hotelshub.herokuapp.com/search?query=tree

### Side note: 
   Check screenshots folder for visual details.

### Instructions to deploy
##### Deploy to Heroku
Create an account and new Database on mlab under free version. Add credentials in config/database.js file.

1. Create an account on Heroku.
2. Create a new app.
3. After app is created, click on Resources tab.
4. Search for mlab, click on it and provision a free version.
5. Create a repository on bitbucket or github.
6. Download and install heroku toolbelt.
7. Inside your app folder on local, type following commands:
   * git init
   * git remote add origin <url to git repo ending with .git>
   * git push -u origin --all
   * heroku login, and fill in your credentials
   * heroku git:remote -a <app-name from heroku>
   * git push heroku master
8. Your app is now hosted on Heroku, you can check by visiting <app-name from heroku>.herokuapp.com