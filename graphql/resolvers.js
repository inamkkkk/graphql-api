const User = require('../models/User');
const Todo = require('../models/Todo');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
  todos: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const todos = await Todo.find({ creator: req.userId });
      return todos.map(todo => {
        return { ...todo._doc, id: todo._id.toString() }; // Ensure id is a string
      });
    } catch (err) {
      throw err;
    }
  },
  todo: async ({ id }, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const todo = await Todo.findById(id);
      if (!todo) {
        throw new Error('Todo not found.');
      }
      return { ...todo._doc, id: todo._id.toString() };
    } catch (err) {
      throw err;
    }
  },
  users: async () => {
    try {
      const users = await User.find();
      return users.map(user => {
        return { ...user._doc, id: user._id.toString() };
      });
    } catch (err) {
      throw err;
    }
  },
  user: async ({ id }) => {
    try {
      const user = await User.findById(id);
      return { ...user._doc, id: user._id.toString() };
    } catch (err) {
      throw err;
    }
  },
  createTodo: async ({ text }, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    const todo = new Todo({
      text: text,
      completed: false,
      creator: req.userId
    });
    try {
      const result = await todo.save();
      const creator = await User.findById(req.userId);
      if (!creator) {
        throw new Error('User not found.');
      }
      creator.todos.push(todo);
      await creator.save();
      return { ...result._doc, id: result._id.toString() };
    } catch (err) {
      throw err;
    }
  },
  updateTodo: async ({ id, text, completed }, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const todo = await Todo.findById(id);
      if (!todo) {
        throw new Error('Todo not found.');
      }
      if (todo.creator.toString() !== req.userId) {
        throw new Error('Not authorized to update this todo.');
      }

      if (text) todo.text = text;
      if (completed !== undefined) todo.completed = completed;

      const updatedTodo = await todo.save();
      return { ...updatedTodo._doc, id: updatedTodo._id.toString() };
    } catch (err) {
      throw err;
    }
  },
  deleteTodo: async ({ id }, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const todo = await Todo.findById(id);
      if (!todo) {
        throw new Error('Todo not found.');
      }
      if (todo.creator.toString() !== req.userId) {
        throw new Error('Not authorized to delete this todo.');
      }

      await Todo.findByIdAndRemove(id);
      return true;
    } catch (err) {
      throw err;
    }
  },
  createUser: async ({ username, email, password }) => {
    try {
      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        throw new Error('User exists already.');
      }
      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new User({
        username: username,
        email: email,
        password: hashedPassword
      });
      const result = await user.save();
      return { ...result._doc, password: null, id: result._id.toString() };
    } catch (err) {
      throw err;
    }
  },
  login: async ({ email, password }) => {
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        throw new Error('Invalid credentials.');
      }
      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
        throw new Error('Invalid credentials.');n      }
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      return { token: token, userId: user.id };
    } catch (err) {
      throw err;
    }
  }
};