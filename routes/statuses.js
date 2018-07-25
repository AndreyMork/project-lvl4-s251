import { buildFormObj, buildFlashMsg, requiredAuth } from '../lib';

export default (router, db) => {
  const { TaskStatus, Task } = db;

  router
    .get('statuses#index', '/statuses', async (ctx) => {
      const statuses = await TaskStatus.scope('sorted').findAll();

      const viewArgs = {
        statuses,
        pageTitle: 'Tasks',
      };

      ctx.render('statuses', viewArgs);
    })
    .post('statuses#create', '/statuses', requiredAuth, async (ctx) => {
      const { form } = ctx.request.body;

      const task = TaskStatus.build(form);

      try {
        await task.save();
        ctx.flash.set(buildFlashMsg('Status was successfully created', 'success'));
        ctx.redirect(router.url('statuses#index'));
      } catch (err) {
        // TODO: error message
        const viewArgs = {
          formObj: buildFormObj(task, err),
          pageTitle: 'New Status',
        };
        // ctx.flash.set(buildFlashMsg(err.message, 'danger'));

        ctx.render('statuses/new', viewArgs);
      }
    })
    .get('statuses#new', '/statuses/new', requiredAuth, async (ctx) => {
      const status = TaskStatus.build();

      const viewArgs = {
        status,
        formObj: buildFormObj(status),
        pageTitle: 'New Status',
      };

      ctx.render('statuses/new', viewArgs);
    })
    .get('statuses#edit', '/statuses/:id/edit', requiredAuth, async (ctx) => {
      const id = Number(ctx.params.id);
      const status = await TaskStatus.findById(id);

      const viewArgs = {
        status,
        formObj: buildFormObj(status),
        pageTitle: 'Edit Task',
      };

      ctx.render('statuses/edit', viewArgs);
    })
    .put('statuses#update', '/statuses/:id', requiredAuth, async (ctx) => {
      const id = Number(ctx.params.id);
      const status = await TaskStatus.findById(id);

      const { form } = ctx.request.body;

      try {
        await status.update(form);
        ctx.flash.set(buildFlashMsg('Status was successfully renamed', 'success'));
        ctx.redirect(router.url('statuses#index'));
      } catch (err) {
        // TODO: error message
        const viewArgs = {
          status,
          formObj: buildFormObj(status, err),
          pageTitle: 'Edit Task',
        };

        ctx.render('statuses/edit', viewArgs);
      }
    })
    .get('statuses#delete', '/statuses/:id/delete', requiredAuth, async (ctx) => {
      const id = Number(ctx.params.id);
      const status = await TaskStatus.findById(id);
      const { count, rows } = await Task.scope('sorted').findAndCount({
        where: {
          status_id: status.id,
        },
      });

      const viewArgs = {
        status,
        deletable: count === 0,
        taskWithThisStatus: rows,
        formObj: buildFormObj(status),
        pageTitle: 'Delete Task',
      };

      ctx.render('statuses/delete', viewArgs);
    })
    .delete('statuses#destroy', '/statuses/:id', requiredAuth, async (ctx) => {
      const id = Number(ctx.params.id);
      const status = await TaskStatus.findById(id);

      try {
        await status.destroy();
        ctx.flash.set(buildFlashMsg('The status was deleted', 'info'));
      } catch (err) {
        // TODO: error message
        ctx.flash.set(buildFlashMsg('There were errors', 'danger'));
        console.error(err);
      }

      ctx.redirect(router.url('statuses#index'));
    });
};
