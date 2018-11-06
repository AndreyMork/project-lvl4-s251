import _ from 'lodash';
import encrypt from './encrypt';

export encrypt from './encrypt';

export const buildFormObj = (object, error = { errors: [] }) => ({
  name: 'form',
  object,
  errors: _.groupBy(error.errors, 'path'),
});

export const buildFlashMsg = (text, type = 'info') => ({ text, type });

export const capitalize = (value) => {
  if (!(value.trim())) {
    return '';
  }
  const [first, ...rest] = value.toLowerCase().trim();
  return `${first.toUpperCase()}${rest.join('')}`;
};

export const requiredAuth = async (ctx, next) => {
  if (!ctx.state.isSignedIn()) {
    if (ctx.req.method !== 'GET') {
      ctx.throw(401);
    }

    ctx.flash.set(buildFlashMsg('Authentication is required', 'info'));
    ctx.redirect(ctx.router.url('session#new'));
    return;
  }
  await next();
};

export const validateIdInUrl = async (ctx, next) => {
  const idStr = ctx.params.id;
  const isPositiveNumStr = str => /^\d+$/.test(str);
  if (!isPositiveNumStr(idStr)) {
    ctx.flash.set(buildFlashMsg('Not Num', 'info'));
    ctx.status = 404;
    ctx.render('pages/notFound', { pageTitle: 'Not Found' });
    return;
  }

  await next();
};

export default {
  buildFlashMsg,
  encrypt,
  buildFormObj,
  capitalize,
  requiredAuth,
  validateIdInUrl,
};
