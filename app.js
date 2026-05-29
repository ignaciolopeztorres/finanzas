import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import lessMiddleware from 'less-middleware';
import logger from 'morgan';

import indexRouter from './routes/index.routes.js';
import usersRouter from './routes/users.routes.js';
import categoryRoutes from './routes/category.routes.js';
import incomeRoutes from './routes/income.routes.js';
import expensesRoutes from './routes/expenses.routes.js';
import produdctRoutes from './routes/products.routes.js';
import servicesRoutes from './routes/services.routes.js';
import paymentRoutes from './routes/payments.routes.js';

import {
  requestUser
} from './utils/lib/helpers.js';
var app = express();

const __dirname =
  import.meta.dirname;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public'), {
  debug: true,
  force: true,
  dest: './public',
  render: {
    compress: false
  }
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(requestUser());

//rutas
app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/categories', categoryRoutes);
app.use('/api/incomes', incomeRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/products', produdctRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/payments', paymentRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;