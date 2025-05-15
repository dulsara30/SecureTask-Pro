import { useState, useEffect } from 'react';
     import axios from 'axios';
     import DOMPurify from 'dompurify';

     function Home() {
       const [tasks, setTasks] = useState([]);
       const [newTask, setNewTask] = useState({ title: '', description: '', category: 'Other', status: 'Pending' });
       const [error, setError] = useState('');
       const [isAdmin, setIsAdmin] = useState(false);

       useEffect(() => {
         fetchTasks();
         checkAdmin();
       }, []);

       const fetchTasks = async () => {
         try {
           const res = await axios.get('/api/tasks', { withCredentials: true });
           setTasks(res.data);
         } catch (err) {
           setError(err.response?.data?.message || 'Failed to fetch tasks');
         }
       };

       const checkAdmin = async () => {
         try {
           const res = await axios.get('/api/auth/check-role', { withCredentials: true });
           setIsAdmin(res.data.role === 'admin');
         } catch (err) {
           setIsAdmin(false);
         }
       };

       const handleCreateTask = async (e) => {
         e.preventDefault();
         setError('');
         const cleanTask = {
           title: DOMPurify.sanitize(newTask.title),
           description: DOMPurify.sanitize(newTask.description),
           category: newTask.category,
           status: newTask.status,
         };

         try {
           await axios.post('/api/tasks', cleanTask, { withCredentials: true });
           setNewTask({ title: '', description: '', category: 'Other', status: 'Pending' });
           fetchTasks();
         } catch (err) {
           setError(err.response?.data?.message || 'Failed to create task');
         }
       };

       const handleUpdateTask = async (id, updates) => {
         try {
           await axios.put(`/api/tasks/${id}`, updates, { withCredentials: true });
           fetchTasks();
         } catch (err) {
           setError(err.response?.data?.message || 'Failed to update task');
         }
       };

       const handleDeleteTask = async (id) => {
         try {
           await axios.delete(`/api/tasks/${id}`, { withCredentials: true });
           fetchTasks();
         } catch (err) {
           setError(err.response?.data?.message || 'Failed to delete task');
         }
       };

       return (
         <div className="container mx-auto p-4">
           <h2 className="text-2xl font-bold mb-4">Tasks {isAdmin ? '(Admin)' : ''}</h2>
           {error && <p className="text-red-500 mb-4">{error}</p>}
           <form onSubmit={handleCreateTask} className="mb-8 max-w-md">
             <div className="mb-4">
               <label className="block text-gray-700">Title</label>
               <input
                 type="text"
                 value={newTask.title}
                 onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                 className="w-full p-2 border rounded"
                 required
               />
             </div>
             <div className="mb-4">
               <label className="block text-gray-700">Description</label>
               <textarea
                 value={newTask.description}
                 onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                 className="w-full p-2 border rounded"
               />
             </div>
             <div className="mb-4">
               <label className="block text-gray-700">Category</label>
               <select
                 value={newTask.category}
                 onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                 className="w-full p-2 border rounded"
               >
                 <option value="Work">Work</option>
                 <option value="Personal">Personal</option>
                 <option value="Other">Other</option>
               </select>
             </div>
             <div className="mb-4">
               <label className="block text-gray-700">Status</label>
               <select
                 value={newTask.status}
                 onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                 className="w-full p-2 border rounded"
               >
                 <option value="Pending">Pending</option>
                 <option value="In Progress">In Progress</option>
                 <option value="Completed">Completed</option>
               </select>
             </div>
             <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
               Create Task
             </button>
           </form>
           {/* <div>
             {tasks.map((task) => (
               <div key={task._id} className="border p-4 mb-4 rounded">
                 <h3 className="text-lg font-bold">{task.title}</h3>
                 <p>{task.description}</p>
                 <p>Category: {task.category}</p>
                 <p>Status: {task.status}</p>
                 <p>Created: {new Date(task.createdAt).toLocaleDateString()}</p>
                 {isAdmin && <p>User ID: {task.userId}</p>}
                 <div className="mt-2">
                   <select
                     value={task.status}
                     onChange={(e) => handleUpdateTask(task._id, { status: e.target.value })}
                     className="p-1 border rounded mr-2"
                   >
                     <option value="Pending">Pending</option>
                     <option value="In Progress">In Progress</option>
                     <option value="Completed">Completed</option>
                   </select>
                   <button
                     onClick={() => handleDeleteTask(task._id)}
                     className="bg-red-500 text-white p-1 rounded"
                   >
                     Delete
                   </button>
                 </div>
               </div>
             ))}
           </div> */}
         </div>
       );
     }

     export default Home;