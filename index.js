const 
express = require('express'),
bodyParser = require('body-parser'),
cors = require('cors'),
mailer = require('express-mailer');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));  
app.use(bodyParser.json());

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

mailer.extend(app, {
    from: process.env.GMAIL_ID,
    host: 'smtp.gmail.com', 
    secureConnection: true,
    port: 465,
    transportMethod: 'SMTP',
    auth: {
      user: process.env.GMAIL_ID,
      pass: process.env.GMAIL_PWD
    }
  });

  // app.get('/', function (req, res, next) {
  //   app.mailer.send('email', {
  //     to: 'example@example.com', // REQUIRED. This can be a comma delimited string just like a normal email to field.  
  //     subject: 'Test Email', // REQUIRED. 
  //     otherProperty: 'Other Property' // All additional properties are also passed to the template as local variables. 
  //   }, function (err) {
  //     if (err) {
  //       // handle error 
  //       console.log(err);
  //       res.send('There was an error sending the email');
  //       return;
  //     }
  //     res.send('Email Sent');
  //   });
  // });


  app.get('/', function (req, res, next) {
    res.mailer.render('email', {
      to: 'example@example.com',
      subject: 'Test Email',
      otherProperty: 'Other Property'
    }, function (err, message) {
      if (err) {
        // handle error 
        console.log(err);
        res.send('There was an error rendering the email');
        return;
      }
      res.header('Content-Type', 'text/html');
      res.send(message);
    });
  });

onServerStart = () => {
    console.log("App listening at http://%s:%s", server.address().address, server.address().port);
};

let server = app.listen(process.env.PORT | 8081, onServerStart); // taskkill /f /im node.exe