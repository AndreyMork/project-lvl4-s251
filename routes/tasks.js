import { User, Task, TaskStatus } from '../models';
import { buildFormObj, buildFlashMsg } from '../lib';

const getFilters = query => Object.keys(query).reduce((acc, key) => {
  if (!query[key]) {
    return acc;
  }

  return { ...acc, [key]: Number(query[key]) };
}, {});

export default (router) => {
  router
    .get('tasks', '/tasks', async (ctx) => {
      const { query } = ctx.request;
      const filters = getFilters(query);

      const tasks = await Task.findAll({
        where: filters,
        include: ['creator', 'status', 'assignee'],
      });

      const users = await User.findAll()
        .then(vals => vals.map(el => ({ text: el.fullName, value: el.id })));
      const statuses = await TaskStatus.findAll()
        .then(vals => vals.map(el => ({ text: el.name, value: el.id })));

      const viewArgs = {
        tasks,
        users,
        statuses,
        filters,
        pageTitle: 'Tasks',
      };

      ctx.render('tasks', viewArgs);
    })
    .post('tasks', '/tasks', async (ctx) => {
      if (!ctx.state.isSignedIn()) {
        ctx.throw(401);
        return;
      }

      const { form } = ctx.request.body;

      const task = Task.build(form);
      const creator = await User.findById(ctx.session.userId);
      const status = await TaskStatus.findById(form.statusId);
      const assignee = await User.findById(form.assigneeId);

      task.setCreator(creator, { save: false });
      task.setStatus(status, { save: false });
      task.setAssignee(assignee, { save: false });

      try {
        await task.save();
        ctx.flash.set(buildFlashMsg('Task was successfully created', 'success'));
        ctx.redirect(router.url('tasks'));
      } catch (err) {
        // TODO: error message
        const viewArgs = {
          formObj: buildFormObj(task, err),
          pageTitle: 'New Task',
        };
        ctx.flash.set(buildFlashMsg(err.message, 'danger'));

        ctx.render('tasks/new', viewArgs);
      }
    })
    .get('createTask', '/tasks/new', async (ctx) => {
      if (!ctx.state.isSignedIn()) {
        ctx.redirect(router.url('newSession'));
        return;
      }

      const task = Task.build();

      const defaultStatus = await TaskStatus.getDefault()
        .then(status => ({ text: status.name, value: status.id }));
      const statuses = await TaskStatus.getNotDefault()
        .then(values => values.map(el => ({ text: el.name, value: el.id })));
      const users = await User.findAll()
        .then(values => values.map(el => ({ text: el.fullName, value: el.id })));

      const viewArgs = {
        statuses,
        defaultStatus,
        users,
        formObj: buildFormObj(task),
        pageTitle: 'New Task',
      };

      ctx.render('tasks/new', viewArgs);
    })
    .get('task', '/tasks/:id', async (ctx) => {
      const id = Number(ctx.params.id);
      const task = await Task.findById(id, { include: ['creator', 'status', 'assignee'] });

      const viewArgs = {
        task,
        pageTitle: task.name,
      };

      ctx.render('tasks/task', viewArgs);
    })
    .get('editTask', '/tasks/:id/edit', async (ctx) => {
      if (!ctx.state.isSignedIn()) {
        ctx.redirect(router.url('newSession'));
        return;
      }

      const id = Number(ctx.params.id);
      const task = await Task.findById(id, { include: ['creator', 'status', 'assignee'] });

      const currentStatus = { value: task.status.id, text: task.status.name };
      const statuses = await TaskStatus.findAll({
        where: {
          id: {
            not: task.status.id,
          },
        },
      }).then(values => values.map(el => ({ text: el.name, value: el.id })));
      const currentAssignee = { value: task.assignee.id, text: task.assignee.fullName };
      const users = await User.findAll({
        where: {
          id: {
            not: task.assignee.id,
          },
        },
      }).then(values => values.map(el => ({ text: el.fullName, value: el.id })));

      const viewArgs = {
        task,
        currentStatus,
        statuses,
        currentAssignee,
        users,
        formObj: buildFormObj(task),
        pageTitle: 'Edit Task',
      };

      ctx.render('tasks/edit', viewArgs);
    })
    .put('editTask', '/tasks/:id/edit', async (ctx) => {
      if (!ctx.state.isSignedIn()) {
        ctx.throw(401);
        return;
      }

      const id = Number(ctx.params.id);
      const task = await Task.findById(id);

      const { form } = ctx.request.body;

      const { name, description } = form;
      const status = await TaskStatus.findById(form.statusId);
      const assignee = await User.findById(form.assigneeId);

      task.setStatus(status, { save: false });
      task.setAssignee(assignee, { save: false });

      try {
        await task.update({ name, description });
        await task.save();
        ctx.flash.set(buildFlashMsg('Task was successfully changed', 'success'));
        ctx.redirect(router.url('task', task.id));
      } catch (err) {
        // TODO: error message
        // const viewArgs = {
        //   formObj: buildFormObj(task, err),
        //   pageTitle: 'New Task',
        // };
        ctx.flash.set(buildFlashMsg(err.message, 'danger'));

        ctx.redirect(router.url('task', task.id));
      }
    })
    .get('deleteTask', '/tasks/:id/delete', async (ctx) => {
      if (!ctx.state.isSignedIn()) {
        ctx.redirect(router.url('newSession'));
        return;
      }

      const id = Number(ctx.params.id);
      const task = await Task.findById(id, { include: ['creator', 'status', 'assignee'] });

      const viewArgs = {
        task,
        pageTitle: `Delete ${task.name}`,
      };

      ctx.render('tasks/delete', viewArgs);
    })
    .delete('deleteTask', '/tasks/:id/delete', async (ctx) => {
      if (!ctx.state.isSignedIn()) {
        ctx.throw(401);
        return;
      }

      const id = Number(ctx.params.id);
      const task = await Task.findById(id);

      try {
        await task.destroy();
        ctx.flash.set(buildFlashMsg('The task was deleted', 'info'));
      } catch (err) {
        // TODO: error message
        ctx.flash.set(buildFlashMsg('There were errors', 'danger'));
        console.error(err);
      }

      ctx.redirect(router.url('tasks'));
    });
};
