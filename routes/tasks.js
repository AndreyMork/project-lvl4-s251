import _ from 'lodash';
import {
  User,
  Task,
  TaskStatus,
  Tag,
} from '../models';
import {
  buildFormObj,
  buildFlashMsg,
  capitalize,
  requiredAuth,
} from '../lib';

const getFilters = query => Object.keys(query).reduce((acc, key) => {
  if (!query[key]) {
    return acc;
  }

  return { ...acc, [key]: Number(query[key]) };
}, {});

const getTags = async (str) => {
  const separatedStr = str.split(',').map(capitalize);

  const tags = await Promise.all(separatedStr
    .filter(tagStr => tagStr !== '')
    .map(tagStr => Tag.findOrCreate({
      where: {
        name: tagStr,
      },
    })));

  return _.uniqBy(tags.map(([tag]) => tag), tag => tag.id);
};

const getSelectValues = values => values
  .map(el => ({ text: el.name || el.fullName, value: el.id }));

export default (router) => {
  router
    .get('tasks#index', '/tasks', async (ctx) => {
      const { query } = ctx.request;
      const filters = getFilters(query);

      const tasks = await Task.findAndFilterAll(filters);

      const users = await User.findAll()
        .then(getSelectValues);
      const statuses = await TaskStatus.findAll({ order: [['name', 'ASC']] })
        .then(getSelectValues);
      const tags = await Tag.findAll({ order: [['name', 'ASC']] })
        .then(getSelectValues);

      const viewArgs = {
        tasks,
        users,
        statuses,
        tags,
        filters,
        pageTitle: 'Tasks',
      };

      ctx.render('tasks', viewArgs);
    })
    .post('tasks#create', '/tasks', requiredAuth, async (ctx) => {
      const { form } = ctx.request.body;

      const task = Task.build(form);
      const creator = await User.findById(ctx.session.userId);
      const status = await TaskStatus.findById(form.statusId);
      const assignee = await User.findById(form.assigneeId);
      const tags = await getTags(form.tags);

      task.setCreator(creator, { save: false });
      task.setStatus(status, { save: false });
      task.setAssignee(assignee, { save: false });

      try {
        await task.save();
        await task.addTags(tags);

        ctx.flash.set(buildFlashMsg('Task was successfully created', 'success'));
        ctx.redirect(router.url('tasks#index'));
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
    .get('tasks#new', '/tasks/new', requiredAuth, async (ctx) => {
      const task = Task.build();

      const defaultStatus = await TaskStatus.getDefault()
        .then(status => ({ text: status.name, value: status.id }));
      const statuses = await TaskStatus.getNotDefault()
        .then(getSelectValues);
      const users = await User.findAll()
        .then(getSelectValues);

      const viewArgs = {
        statuses,
        defaultStatus,
        users,
        formObj: buildFormObj(task),
        pageTitle: 'New Task',
      };

      ctx.render('tasks/new', viewArgs);
    })
    .get('tasks#show', '/tasks/:id', async (ctx) => {
      const id = Number(ctx.params.id);
      const task = await Task.findById(id, { include: ['creator', 'status', 'assignee', 'tags'] });

      const tags = await Tag.findAll({ order: [['name', 'ASC']] })
        .then(getSelectValues);

      const viewArgs = {
        task,
        tags,
        pageTitle: task.name,
      };

      ctx.render('tasks/task', viewArgs);
    })
    .get('tasks#edit', '/tasks/:id/edit', requiredAuth, async (ctx) => {
      const id = Number(ctx.params.id);
      const task = await Task.findById(id, { include: ['creator', 'status', 'assignee', 'tags'] });

      const currentStatus = { value: task.status.id, text: task.status.name };
      const statuses = await TaskStatus.findAll({
        where: {
          id: {
            not: task.status.id,
          },
        },
        order: [['name', 'ASC']],
      }).then(getSelectValues);
      const currentAssignee = { value: task.assignee.id, text: task.assignee.fullName };
      const users = await User.findAll({
        where: {
          id: {
            not: task.assignee.id,
          },
        },
      }).then(getSelectValues);
      const tagStr = await task.getTags()
        .then(values => values.map(tag => tag.name).join(', '));

      const viewArgs = {
        task,
        currentStatus,
        statuses,
        currentAssignee,
        users,
        tagStr,
        formObj: buildFormObj(task),
        pageTitle: 'Edit Task',
      };

      ctx.render('tasks/edit', viewArgs);
    })
    .put('tasks#update', '/tasks/:id/edit', requiredAuth, async (ctx) => {
      const id = Number(ctx.params.id);
      const task = await Task.findById(id);

      const { form } = ctx.request.body;

      const { name, description } = form;
      const status = await TaskStatus.findById(form.statusId);
      const assignee = await User.findById(form.assigneeId);

      const tags = await getTags(form.tags);

      task.setStatus(status, { save: false });
      task.setAssignee(assignee, { save: false });

      try {
        await task.update({ name, description });
        await task.save();
        await task.setTags(tags);
        ctx.flash.set(buildFlashMsg('Task was successfully changed', 'success'));
        ctx.redirect(router.url('tasks#show', task.id));
      } catch (err) {
        // TODO: error message
        // const viewArgs = {
        //   formObj: buildFormObj(task, err),
        //   pageTitle: 'New Task',
        // };
        ctx.flash.set(buildFlashMsg(err.message, 'danger'));

        ctx.redirect(router.url('tasks#show', task.id));
      }
    })
    .get('tasks#delete', '/tasks/:id/delete', requiredAuth, async (ctx) => {
      const id = Number(ctx.params.id);
      const task = await Task.findById(id, { include: ['creator', 'status', 'assignee', 'tags'] });

      const viewArgs = {
        task,
        pageTitle: `Delete ${task.name}`,
      };

      ctx.render('tasks/delete', viewArgs);
    })
    .delete('tasks#destroy', '/tasks/:id', requiredAuth, async (ctx) => {
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

      ctx.redirect(router.url('tasks#index'));
    });
};
