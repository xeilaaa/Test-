import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { addTodo, getTodos, updateTodo, deleteTodo } from './Configuration/firebaseUtils';

export interface Todo {
  id: string;
  text: string;
  userId?: string;
}

const Main: React.FC = () => {
  const [todo, setTodo] = useState<string>('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentTodo, setCurrentTodo] = useState<Todo | null>(null);
  const auth = getAuth();
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchTodos = async () => {
      if (user) {
        try {
          console.log('Fetching todos for user:', user.uid); // Debug log
          const todosData = await getTodos(user.uid);
          console.log('Todos fetched:', todosData); // Debug log
          setTodos(todosData);
        } catch (error) {
          console.error('Error fetching todos: ', error);
        }
      }
    };

    fetchTodos();
  }, [user]);

  const handleAddTodo = async (event: React.FormEvent) => {
    event.preventDefault();
    if (todo.trim() === '') {
      console.log('Todo input is empty'); // Debug log
      return;
    }
    console.log('Adding todo:', todo); // Debug log

    try {
      if (user) {
        const newTodoId = await addTodo(todo, user.uid);
        const newTodo: Todo = { id: newTodoId, text: todo };
        console.log('New todo added:', newTodo); // Debug log
        setTodos(prevTodos => [...prevTodos, newTodo]);
        setTodo('');
      } else {
        console.log('User is not authenticated'); // Debug log
      }
    } catch (error) {
      console.error('Error adding todo: ', error);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      console.log('Deleting todo with id:', id); // Debug log
      await deleteTodo(id);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo: ', error);
    }
  };

  const handleUpdateTodo = async (event: React.FormEvent) => {
    event.preventDefault();
    if (currentTodo && todo.trim() !== '') {
      try {
        console.log('Updating todo with id:', currentTodo.id); // Debug log
        await updateTodo(currentTodo.id, todo);
        setTodos(todos.map((t) => (t.id === currentTodo.id ? { ...t, text: todo } : t)));
        setTodo('');
        setIsEditing(false);
        setCurrentTodo(null);
      } catch (error) {
        console.error('Error updating todo: ', error);
      }
    } else {
      console.log('Todo input is empty or no todo selected for editing'); // Debug log
    }
  };

  const startEditing = (todo: Todo) => {
    setIsEditing(true);
    setCurrentTodo(todo);
    setTodo(todo.text);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setCurrentTodo(null);
    setTodo('');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
        <Typography variant="h4" component="h1" gutterBottom>
          To-Do List
        </Typography>
        <Box
          component="form"
          onSubmit={isEditing ? handleUpdateTodo : handleAddTodo}
          display="flex"
          flexDirection="column"
          width="100%"
        >
          <TextField
            label="New Task"
            fullWidth
            margin="normal"
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            {isEditing ? 'Update Task' : 'Add Task'}
          </Button>
          {isEditing && (
            <Button variant="outlined" color="secondary" fullWidth sx={{ mt: 1 }} onClick={cancelEditing}>
              Cancel
            </Button>
          )}
        </Box>
        <List sx={{ width: '100%', mt: 2 }}>
          {todos.map((todo) => (
            <ListItem
              key={todo.id}
              secondaryAction={
                <>
                  <IconButton edge="end" aria-label="edit" onClick={() => startEditing(todo)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteTodo(todo.id)}>
                    <DeleteIcon />
                  </IconButton>
                </>
              }
            >
              <ListItemText primary={todo.text} />
            </ListItem>
          ))}
        </List>
        <Button variant="outlined" color="secondary" onClick={handleLogout} sx={{ mt: 2 }}>
          Logout
        </Button>
      </Box>
    </Container>
  );
};

export default Main;
